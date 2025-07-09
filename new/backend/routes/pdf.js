const express = require('express');
const router = express.Router();
const { uploadPDF, getUserPDFs, deletePDF, testCloudinary, downloadPDF } = require('../controllers/pdfController');


// Test Cloudinary connection (no auth required)
router.get('/test', testCloudinary);

const authMiddleware = require('../middlewares/authMiddleware');
router.use(authMiddleware);

// Upload PDF file to Cloudinary
router.post('/upload', uploadPDF);

// Get all PDFs for the authenticated user
router.get('/list', getUserPDFs);

// Delete a specific PDF
router.delete('/:id', deletePDF);

// Download a PDF generated from resumeData
router.post('/download', downloadPDF);

module.exports = router; 