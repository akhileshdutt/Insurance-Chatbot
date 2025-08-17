import React, { useState } from 'react';
import axios from 'axios';

const HomePage = () => {
    const [messages, setMessages] = useState([{
        sender: 'AI',
        text: "Hello! I'm your insurance chatbot. Please provide a policy document or URL on the left to get started."
    }]);

    const [url, setUrl] = useState('');
    const [file, setFile] = useState(null);
    const [userQuery, setUserQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [sessionId, setSessionId] = useState(null);

    const addMessage = (sender, text) => {
        setMessages(prevMessages => [...prevMessages, { sender, text }]);
    };

    const handleProcess = async () => {
        setIsLoading(true);
        if (url) {
            addMessage('user', `Processing URL: ${url}`);
            try {
                const response = await axios.post('http://localhost:5000/api/process-url', { url });
                setSessionId(response.data.session_id);
                addMessage('AI', response.data.message);
            } catch (error) {
                console.error('Error processing URL:', error);
                addMessage('AI', 'Sorry, an error occurred while processing the URL.');
            } finally {
                setIsLoading(false);
            }
        }
    };

    const sendMessage = async () => {
        if (userQuery.trim() !== '') {
            if (!sessionId) {
                addMessage('AI', 'Please process a document first by providing a URL on the left.');
                return;
            }
            
            const currentQuery = userQuery;
            addMessage('user', currentQuery);
            setUserQuery('');
            setIsLoading(true);
            
            try {
                // Pass the session ID in a custom header
                const response = await axios.post('http://localhost:5000/api/chat', { query: currentQuery }, {
                    headers: { 'X-Session-ID': sessionId }
                });
                addMessage('AI', response.data.message);
            } catch (error) {
                console.error('Error fetching chatbot response:', error);
                addMessage('AI', 'Sorry, I couldn\'t get an answer. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <div class="animated-background flex items-center justify-center min-h-screen p-4">
            <div className="bg-gray-800 text-white rounded-2xl shadow-2xl w-full max-w-4xl flex flex-col lg:flex-row overflow-hidden transform transition-all duration-300 hover:scale-[1.01]">
                {/* Left Panel: URL/Document Input */}
                <div className="w-full lg:w-1/3 p-6 sm:p-9 bg-gray-900 flex flex-col justify-center border-r border-gray-700">
                    <h1 className="text-3xl font-bold mb-6 text-center text-blue-400">Insurance Chatbot</h1>
                    
                    <div className="mb-6">
                        <label htmlFor="url-input" className="block text-sm font-medium text-gray-300 mb-2">
                            Enter Policy URL
                        </label>
                        <input
                            type="text"
                            id="url-input"
                            placeholder="e.g., https://your-policy-docs.com"
                            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-colors"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            disabled={isLoading}
                        />
                    </div>

                    <div className="flex items-center justify-center mb-6">
                        <div className="w-full border-t border-gray-700"></div>
                        <span className="mx-4 text-gray-500">or</span>
                        <div className="w-full border-t border-gray-700"></div>
                    </div>

                    <div className="mb-6">
                        <label htmlFor="document-upload-input" className="block text-sm font-medium text-gray-300 mb-2">
                            Upload Policy Document (PDF, TXT, DOCX)
                        </label>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-600 border-dashed rounded-lg hover:border-blue-400 transition-colors cursor-pointer">
                            <div className="space-y-1 text-center">
                                <svg
                                    className="mx-auto h-12 w-12 text-blue-400"
                                    stroke="currentColor"
                                    fill="none"
                                    viewBox="0 0 48 48"
                                    aria-hidden="true"
                                >
                                    <path
                                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.2 3.2C30.65 24.8 28.5 26 26 26h-4a4 4 0 01-4-4v-4a4 4 0 014-4h4c2.5 0 4.65 1.2 5.8 3.2L36 18z"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                                <div className="flex text-sm text-gray-400">
                                    <label htmlFor="document-upload-input" className="relative cursor-pointer rounded-md font-medium text-blue-400 hover:text-blue-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-400">
                                        <span>Upload a file</span>
                                        <input
                                            id="document-upload-input"
                                            name="file-upload"
                                            type="file"
                                            className="sr-only"
                                            onChange={(e) => setFile(e.target.files[0])}
                                            disabled={isLoading}
                                        />
                                    </label>
                                    <p className="pl-1">or drag and drop</p>
                                </div>
                                <p className="text-xs text-gray-500">
                                    PDF, DOCX, TXT up to 10MB
                                </p>
                            </div>
                        </div>
                    </div>

                    <button
                        id="process-button"
                        onClick={handleProcess}
                        className="w-full py-3 px-4 text-white font-semibold rounded-lg shadow-lg gradient-button"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Processing...' : 'Process Document'}
                    </button>
                </div>

                {/* Right Panel: Chat Interface */}
                <div className="w-full lg:w-2/3 p-4 sm:p-6 flex flex-col justify-between">
                    <div id="chat-window" className="chat-container flex flex-col space-y-4 p-4 border border-gray-700 rounded-lg mb-4 h-96 overflow-y-auto bg-gray-700">
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex items-start space-x-2 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                                <span className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0 ${msg.sender === 'user' ? 'bg-blue-600 order-2' : 'bg-blue-400 order-1'}`}>
                                    {msg.sender === 'user' ? 'You' : 'AI'}
                                </span>
                                <div className={`p-3 rounded-2xl max-w-xs sm:max-w-md shadow-md ${msg.sender === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-gray-600 text-gray-200 rounded-tl-none'}`}>
                                    <p>{msg.text}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex items-center space-x-3">
                        <input
                            type="text"
                            id="user-query"
                            placeholder="Ask me a question about your policy..."
                            className="flex-grow px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-colors"
                            value={userQuery}
                            onChange={(e) => setUserQuery(e.target.value)}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    sendMessage();
                                }
                            }}
                            disabled={isLoading}
                        />
                        <button
                            id="send-button"
                            onClick={sendMessage}
                            className="w-12 h-12 text-white rounded-full flex items-center justify-center shadow-lg gradient-button"
                            disabled={isLoading}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;