// // This file handles the communication between Node.js and the Python script.
// const { spawn } = require('child_process');

// const runChatbotLogic = (req, res) => {
//     const { query } = req.body;
    
//     // Check if a query was provided
//     if (!query) {
//         return res.status(400).json({ error: 'Query parameter is missing.' });
//     }

//     // Spawn a child process to run the Python script.
//     // The first argument is the command ('python' or 'python3').
//     // The second argument is an array of arguments for the Python script.
//     const pythonProcess = spawn('python', ['chatbot_logic/main.py', query]);

//     let chatbotResponse = '';
//     let errorData = '';

//     // Capture standard output from the Python script
//     pythonProcess.stdout.on('data', (data) => {
//         chatbotResponse += data.toString();
//     });

//     // Capture standard error from the Python script
//     pythonProcess.stderr.on('data', (data) => {
//         errorData += data.toString();
//     });

//     // When the Python process exits, send the response back to the client.
//     pythonProcess.on('close', (code) => {
//         if (code !== 0) {
//             console.error(`Python process exited with code ${code}. Error: ${errorData}`);
//             return res.status(500).json({ error: 'Failed to get a response from the chatbot.' });
//         }
//         res.json({ message: chatbotResponse.trim() });
//     });
// };

// module.exports = { runChatbotLogic };



// insurance-server/controllers/chatbotController.js
// const axios = require('axios');
// const FormData = require('form-data');
// const fs = require('fs');

// // Define the URL of your Python FastAPI server.
// const PYTHON_API_URL = 'http://localhost:8000';

// const getChatbotResponse = async (req, res) => {
//     const { query } = req.body;
//     if (!query) {
//         return res.status(400).json({ error: 'Query parameter is missing.' });
//     }

//     try {
//         const payload = {
//             // As per your Python code, 'documents' is mandatory.
//             // We set it to null when only a question is being asked.
//             documents: null,
//             questions: [query]
//         };

//         const response = await axios.post(`${PYTHON_API_URL}/hackrx/run`, payload, {
//             headers: {
//                 'Authorization': `Bearer ${process.env.VALID_TOKEN}`
//             }
//         });

//         const chatbotAnswer = response.data.answers[0] || 'No answer found.';
//         res.json({ message: chatbotAnswer.trim() });
//     } catch (error) {
//         console.error('Error proxying to Python API:', error.message);
//         console.error('Response from Python API:', error.response?.data);
//         res.status(500).json({ error: 'Failed to get a response from the chatbot.' });
//     }
// };

// const processDocument = async (req, res) => {
//     try {
//         let payload;

//         if (req.file) {
//             // Your Python code does not have a separate file upload endpoint.
//             // The /hackrx/run endpoint only handles URLs.
//             // Therefore, file upload functionality needs to be developed in Python first.
//             // For now, let's return an error.
//             return res.status(501).json({ error: 'File upload not yet supported by the Python API.' });
//         } else if (req.body.url) {
//             const { url } = req.body;
            
//             // This is the correct payload format that the Python API expects.
//             payload = {
//                 documents: url,
//                 questions: [] // 'questions' is mandatory, even if empty.
//             };

//             const response = await axios.post(`${PYTHON_API_URL}/hackrx/run`, payload, {
//                 headers: {
//                     'Authorization': `Bearer ${process.env.VALID_TOKEN}`
//                 }
//             });
            
//             // Your Python API returns a 200 status, which we can use to confirm success.
//             return res.status(response.status).json({ message: "Document processed successfully." });
//         } else {
//             return res.status(400).json({ error: 'No URL or file provided.' });
//         }
//     } catch (error) {
//         console.error('Error proxying to Python API:', error.message);
//         console.error('Response from Python API:', error.response?.data);
//         res.status(500).json({ error: 'Failed to process document.' });
//     }
// };

// module.exports = { getChatbotResponse, processDocument };


const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

const PYTHON_API_URL = 'http://localhost:8000';

const getChatbotResponse = async (req, res) => {
    const { query } = req.body;
    const sessionId = req.headers['x-session-id']; // Retrieve session ID from headers

    if (!query) {
        return res.status(400).json({ error: 'Query parameter is missing.' });
    }

    if (!sessionId) {
        return res.status(400).json({ error: 'Session ID is missing. Please process a document first.' });
    }

    try {
        const payload = {
            session_id: sessionId,
            question: query
        };
        
        const response = await axios.post(`${PYTHON_API_URL}/ask_question`, payload, {
            headers: {
                'Authorization': `Bearer ${process.env.VALID_TOKEN}`
            }
        });

        const chatbotAnswer = response.data.answer || 'No answer found.';
        res.json({ message: chatbotAnswer.trim() });
    } catch (error) {
        console.error('Error proxying to Python API:', error.message);
        console.error('Response from Python API:', error.response?.data);
        res.status(500).json({ error: 'Failed to get a response from the chatbot.' });
    }
};

const processDocument = async (req, res) => {
    try {
        if (req.file) {
            return res.status(501).json({ error: 'File upload not yet supported by the Python API.' });
        } else if (req.body.url) {
            const { url } = req.body;
            
            const payload = {
                document_url: url
            };

            const response = await axios.post(`${PYTHON_API_URL}/process_document`, payload, {
                headers: {
                    'Authorization': `Bearer ${process.env.VALID_TOKEN}`
                }
            });
            
            // The Python API now returns a session_id.
            const { message, session_id } = response.data;
            return res.status(200).json({ message, session_id });
        } else {
            return res.status(400).json({ error: 'No URL or file provided.' });
        }
    } catch (error) {
        console.error('Error proxying to Python API:', error.message);
        console.error('Response from Python API:', error.response?.data);
        res.status(500).json({ error: 'Failed to process document.' });
    }
};

module.exports = { getChatbotResponse, processDocument };