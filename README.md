<h1 align="center">🤖 BOT_INSU: AI-Powered Insurance Chatbot</h1>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-18+-green?logo=node.js" alt="Node.js Badge">
  <img src="https://img.shields.io/badge/React-18+-blue?logo=react" alt="React Badge">
  <img src="https://img.shields.io/badge/Python-3.10+-yellow?logo=python" alt="Python Badge">
  <img src="https://img.shields.io/badge/MongoDB-Atlas-success?logo=mongodb" alt="MongoDB Badge">
  <img src="https://img.shields.io/badge/License-MIT-red?logo=open-source-initiative" alt="License Badge">
</p>

<hr>

<h2>✨ Overview</h2>
<p>
A full-stack <b>insurance chatbot</b> designed to answer queries from insurance policy documents (via URL or upload).<br>
Built with a <b>React frontend</b>, <b>Node.js proxy server</b>, and a <b>Python FastAPI backend</b> for intelligent document processing and AI-powered responses.
</p>

<hr>

<h2>🌟 Key Features</h2>
<ul>
  <li><b>Frontend (React + Tailwind CSS)</b>
    <ul>
      <li>✅ Responsive UI with Login/Register</li>
      <li>✅ Dynamic chat interface</li>
      <li>✅ Document/URL input for policies</li>
    </ul>
  </li>
  <br>
  <li><b>Backend Architecture</b>
    <ul>
      <li>🔹 <b>Node.js Proxy Server</b> – Authentication, MongoDB, secure bridge to Python API</li>
      <li>🔹 <b>Python FastAPI Server</b> – Processes documents, embeddings with FAISS, AI responses</li>
    </ul>
  </li>
  <br>
  <li><b>Data Processing</b>
    <ul>
      <li>📄 Fetch & parse PDF documents</li>
      <li>🔍 FAISS-based similarity search</li>
      <li>🤖 AI-powered contextual answers</li>
    </ul>
  </li>
  <br>
  <li><b>Security</b>
    <ul>
      <li>🔐 JWT-based authentication</li>
      <li>🔑 Bearer token protection (Node.js ↔ FastAPI)</li>
    </ul>
  </li>
</ul>

<hr>

<h2>🛠️ Tech Stack</h2>
<ul>
  <li><b>Frontend</b>
    <ul>
      <li>⚛️ React (UI)</li>
      <li>🌐 Axios (API requests)</li>
      <li>🛤 React Router DOM (Routing)</li>
      <li>🎨 Tailwind CSS (Styling)</li>
    </ul>
  </li>
  <br>
  <li><b>Backend – Node.js</b>
    <ul>
      <li>🚀 Express.js (Server)</li>
      <li>🗄 MongoDB + Mongoose (Database)</li>
      <li>🔒 dotenv (Env vars)</li>
      <li>📡 Axios (Proxy requests)</li>
      <li>📂 Multer (File uploads – planned)</li>
    </ul>
  </li>
  <br>
  <li><b>Backend – Python</b>
    <ul>
      <li>⚡ FastAPI (Core API)</li>
      <li>🔥 Uvicorn (Server)</li>
      <li>🧠 Sentence-Transformers (Embeddings)</li>
      <li>🗂 FAISS (Similarity search)</li>
      <li>📑 PyPDF (PDF parsing)</li>
      <li>🧩 LangChain (Text splitting)</li>
      <li>🤖 OpenAI (LLM)</li>
      <li>🌍 aiohttp (Async downloads)</li>
    </ul>
  </li>
</ul>

<hr>

<h2>🚀 Getting Started</h2>

<h3>✅ Prerequisites</h3>
<ul>
  <li>Node.js v18+</li>
  <li>Python v3.10+</li>
  <li>MongoDB Atlas (or local MongoDB)</li>
  <li>API Key (Together AI / OpenAI)</li>
</ul>

<h3>1️⃣ Clone the Repository</h3>
<pre>
git clone https://github.com/your-username/your-repository-name.git
cd your-repository-name
</pre>

<h3>2️⃣ Configure Environment Variables</h3>
<p>Create a <code>.env</code> file inside <b>insurance-server</b>:</p>
<pre>
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=a_secret_key_for_jwt
PORT=5000
TOGETHER_API_KEY=your_together_ai_api_key
VALID_TOKEN=a_long_secure_token_of_your_choice
</pre>

<h3>3️⃣ Setup & Run the Backend</h3>
<pre>
cd insurance-server
npm install
</pre>

<pre>
cd chatbot_logic
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000
</pre>

<pre>
cd insurance-server
npm start
</pre>

<h3>4️⃣ Setup & Run the Frontend</h3>
<pre>
cd my-app
npm install
npm start
</pre>

<p>Your app will be live at 👉 <a href="http://localhost:3000">http://localhost:3000</a> 🎉</p>

<hr>

<h2>📌 Future Enhancements</h2>
<ul>
  <li>🔄 File upload support (PDFs & Docs)</li>
  <li>📊 Analytics dashboard for insurers</li>
  <li>🛡️ Enhanced role-based authentication</li>
  <li>☁️ Cloud deployment (Docker + Railway/Vercel)</li>
</ul>

<hr>


<h2>🤝 Contributing</h2>

<p>Contributions, issues, and feature requests are welcome!</p>

<hr/>

<h2>📜 License</h2>

<p>This project is licensed under the <b>MIT License</b> - see the <a href="LICENSE">LICENSE</a> file for details.</p>
