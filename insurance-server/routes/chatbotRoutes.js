// // This file defines the API endpoints for the chatbot.
// const express = require('express');
// const router = express.Router();
// const { runChatbotLogic } = require('../controllers/chatbotController');

// // Define a POST endpoint for the chatbot.
// // It will be accessible at /api/chat
// router.post('/chat', runChatbotLogic);

// module.exports = router;


//------------------------------------------------------------------------------------------------
// insurance-server/routes/chatbotRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer'); // Add this line
const { getChatbotResponse, processDocument } = require('../controllers/chatbotController'); // Import both functions

const upload = multer({ dest: 'uploads/' }); // Configure multer to save files to a temporary 'uploads' directory

// Define a POST endpoint for the chatbot query.
router.post('/chat', getChatbotResponse);

// Define the POST endpoint for processing a URL.
router.post('/process-url', processDocument);

// Define the POST endpoint for file uploads.
// `upload.single('file')` is a multer middleware that processes a single file with the key 'file'
router.post('/upload-file', upload.single('file'), processDocument);

module.exports = router;