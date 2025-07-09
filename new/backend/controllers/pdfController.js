const ResumePDF = require('../models/ResumePDF');
const { uploadPDF, deletePDF, getUserPDFs } = require('../config/cloudinary');
const mongoose = require('mongoose');
const fs = require('fs');
const PDFDocument = require('pdfkit');
const path = require('path');

function addSectionHeader(doc, title, color) {
  doc.moveDown(0.5)
    .fontSize(13)
    .font('Helvetica-Bold')
    .fillColor(color)
    .text(title, { underline: true });
  doc.moveDown(0.2);
}

async function generateResumePDF(resumeData) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'A4',
        margins: { top: 50, bottom: 50, left: 50, right: 50 },
      });
      const chunks = [];
      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(chunks);
        fs.writeFileSync('test.pdf', pdfBuffer);
        resolve(pdfBuffer);
      });
      // Set up fonts and colors
      const primaryColor = '#2c3e50';
      const secondaryColor = '#7f8c8d';
      const accentColor = '#3498db';
      // Header Section
      doc.fontSize(28)
         .font('Helvetica-Bold')
         .fillColor(primaryColor)
         .text(resumeData.basicInfo?.fullName || 'No Name Provided', { align: 'center' });
      doc.fontSize(12)
         .font('Helvetica')
         .fillColor(secondaryColor)
         .text(resumeData.basicInfo?.email || 'No Email Provided', { align: 'center' });
      doc.fontSize(12)
         .font('Helvetica')
         .fillColor(secondaryColor)
         .text(resumeData.basicInfo?.phone || 'No Phone Provided', { align: 'center' });
      doc.fontSize(12)
         .font('Helvetica')
         .fillColor(secondaryColor)
         .text(resumeData.basicInfo?.location || 'No Location Provided', { align: 'center' });
      if (resumeData.basicInfo?.linkedin) {
        doc.fontSize(12)
           .font('Helvetica')
           .fillColor(accentColor)
           .text(resumeData.basicInfo.linkedin, { align: 'center', link: resumeData.basicInfo.linkedin });
      }
      if (resumeData.basicInfo?.github) {
        doc.fontSize(12)
           .font('Helvetica')
           .fillColor(accentColor)
           .text(resumeData.basicInfo.github, { align: 'center', link: resumeData.basicInfo.github });
      }
      doc.moveDown(0.5);
      // Summary Section
      addSectionHeader(doc, 'PROFESSIONAL SUMMARY', primaryColor);
      doc.fontSize(11)
         .font('Helvetica')
         .fillColor('#333')
         .text(resumeData.summary || 'No summary provided', {
           align: 'justify',
           lineGap: 2,
         });
      doc.moveDown(0.5);
      // Skills Section
      addSectionHeader(doc, 'SKILLS', primaryColor);
      const skillsText = (resumeData.skills && resumeData.skills.length > 0) ? resumeData.skills.join(' • ') : 'No skills provided';
      doc.fontSize(11)
         .font('Helvetica')
         .fillColor('#333')
         .text(skillsText, {
           align: 'justify',
           lineGap: 2,
         });
      doc.moveDown(0.5);
      // Work Experience Section
      addSectionHeader(doc, 'PROFESSIONAL EXPERIENCE', primaryColor);
      if (resumeData.experience && resumeData.experience.length > 0) {
        resumeData.experience.forEach((exp, index) => {
          if (index > 0) doc.moveDown(0.3);
          doc.fontSize(14)
             .font('Helvetica-Bold')
             .fillColor(primaryColor)
             .text(exp.position);
          doc.fontSize(12)
             .font('Helvetica-Bold')
             .fillColor(accentColor)
             .text(exp.company);
          // Date and Location
          const startDate = new Date(exp.startDate).toLocaleDateString('en-US', {
            year: 'numeric', month: 'short',
          });
          let dateText = startDate;
          if (exp.current) {
            dateText += ' - Present';
          } else if (exp.endDate) {
            const endDate = new Date(exp.endDate).toLocaleDateString('en-US', {
              year: 'numeric', month: 'short',
            });
            dateText += ` - ${endDate}`;
          }
          doc.fontSize(10)
             .font('Helvetica')
             .fillColor(secondaryColor)
             .text(dateText);
          doc.fontSize(11)
             .font('Helvetica')
             .fillColor('#333')
             .text(exp.description, {
               align: 'justify',
               lineGap: 2,
             });
          if (exp.achievements && exp.achievements.length > 0) {
            doc.moveDown(0.2);
            exp.achievements.forEach((achievement) => {
              doc.fontSize(10)
                 .font('Helvetica')
                 .fillColor('#333')
                 .text(`• ${achievement}`, {
                   indent: 10,
                   lineGap: 1,
                 });
            });
          }
        });
      } else {
        doc.fontSize(11)
           .font('Helvetica')
           .fillColor('#333')
           .text('No work experience provided');
      }
      doc.moveDown(0.5);
      // Education Section
      addSectionHeader(doc, 'EDUCATION', primaryColor);
      if (resumeData.education && resumeData.education.length > 0) {
        resumeData.education.forEach((edu, index) => {
          if (index > 0) doc.moveDown(0.3);
          doc.fontSize(14)
             .font('Helvetica-Bold')
             .fillColor(primaryColor)
             .text(edu.degree);
          doc.fontSize(12)
             .font('Helvetica-Bold')
             .fillColor(accentColor)
             .text(edu.school);
          // Date and GPA
          const startDate = new Date(edu.startDate).toLocaleDateString('en-US', {
            year: 'numeric', month: 'short',
          });
          let dateText = startDate;
          if (edu.endDate) {
            const endDate = new Date(edu.endDate).toLocaleDateString('en-US', {
              year: 'numeric', month: 'short',
            });
            dateText += ` - ${endDate}`;
          }
          let infoText = dateText;
          if (edu.gpa) {
            infoText += ` | GPA: ${edu.gpa}`;
          }
          doc.fontSize(10)
             .font('Helvetica')
             .fillColor(secondaryColor)
             .text(infoText);
          doc.fontSize(11)
             .font('Helvetica')
             .fillColor('#333')
             .text(edu.field);
        });
      } else {
        doc.fontSize(11)
           .font('Helvetica')
           .fillColor('#333')
           .text('No education provided');
      }
      // Projects Section (if exists)
      if (resumeData.projects && resumeData.projects.length > 0) {
        doc.moveDown(0.5);
        addSectionHeader(doc, 'PROJECTS', primaryColor);
        resumeData.projects.forEach((project, index) => {
          if (index > 0) doc.moveDown(0.3);
          doc.fontSize(14)
             .font('Helvetica-Bold')
             .fillColor(primaryColor)
             .text(project.title);
          if (project.technologies && project.technologies.length > 0) {
            doc.fontSize(10)
               .font('Helvetica')
               .fillColor(accentColor)
               .text(project.technologies.join(', '));
          }
          doc.fontSize(11)
             .font('Helvetica')
             .fillColor('#333')
             .text(project.description, {
               align: 'justify',
               lineGap: 2,
             });
          if (project.link) {
            doc.fontSize(10)
               .font('Helvetica')
               .fillColor(accentColor)
               .text(project.link, { link: project.link });
          }
          if (project.github) {
            doc.fontSize(10)
               .font('Helvetica')
               .fillColor(accentColor)
               .text(project.github, { link: project.github });
          }
        });
      } else {
        doc.moveDown(0.5);
        addSectionHeader(doc, 'PROJECTS', primaryColor);
        doc.fontSize(11)
           .font('Helvetica')
           .fillColor('#333')
           .text('No projects provided');
      }
      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Upload PDF file to Cloudinary
 */
exports.uploadPDF = async (req, res) => {
  try {
    const { filename, resumeData } = req.body;
    const userId = req.user.userId;

    if (!filename || !resumeData) {
      return res.status(400).json({ 
        message: 'Filename and resume data are required' 
      });
    }

    // Generate PDF using PDFKit
    const pdfBuffer = await generateResumePDF(resumeData);

    // Upload to Cloudinary (new function returns result or throws error)
    let uploadResult;
    try {
      uploadResult = await uploadPDF(pdfBuffer, filename, userId);
    } catch (error) {
      console.error('Cloudinary upload failed:', error);
      return res.status(500).json({ 
        message: 'Failed to upload PDF to Cloudinary',
        error: error.message 
      });
    }

    console.log('PDF uploaded successfully:', uploadResult.secure_url);

    // Save to database
    const resumePDF = new ResumePDF({
      userId,
      filename,
      cloudinaryUrl: uploadResult.secure_url,
      cloudinaryPublicId: uploadResult.public_id,
      fileSize: pdfBuffer.length,
      resumeData,
      template: resumeData.template || 'modern',
      colorScheme: resumeData.colorScheme || 'blue'
    });

    await resumePDF.save();

    res.status(201).json({
      message: 'PDF uploaded successfully',
      data: {
        id: resumePDF._id,
        filename: resumePDF.filename,
        url: resumePDF.cloudinaryUrl,
        fileSize: resumePDF.fileSize,
        createdAt: resumePDF.createdAt
      }
    });

  } catch (error) {
    console.error('PDF upload error:', error);
    res.status(500).json({ 
      message: 'Internal server error',
      error: error.message 
    });
  }
};

/**
 * Get all PDFs for a user
 */
exports.getUserPDFs = async (req, res) => {
  try {
    const userId = req.user.userId;

    console.log(`Fetching PDFs for user: ${userId}`);

    // Check database connection
    if (mongoose.connection.readyState !== 1) {
      console.error('Database not connected. ReadyState:', mongoose.connection.readyState);
      return res.status(503).json({
        message: 'Database connection unavailable',
        error: 'Database is not connected'
      });
    }

    // Get from database with timeout handling
    const pdfs = await Promise.race([
      ResumePDF.find({ userId })
        .sort({ createdAt: -1 })
        .select('-resumeData'),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Database query timeout')), 15000)
      )
    ]);

    console.log(`Found ${pdfs.length} PDFs for user ${userId}`);

    // Transform the data to match frontend expectations
    const transformedPdfs = pdfs.map(pdf => ({
      _id: pdf._id,
      id: pdf._id, // For backward compatibility
      filename: pdf.filename,
      url: pdf.cloudinaryUrl, // Transform cloudinaryUrl to url
      fileSize: pdf.fileSize,
      createdAt: pdf.createdAt,
      template: pdf.template,
      colorScheme: pdf.colorScheme
    }));

    res.json({
      message: 'PDFs retrieved successfully',
      data: transformedPdfs
    });

  } catch (error) {
    console.error('Get PDFs error:', error);
    
    if (error.message === 'Database query timeout') {
      return res.status(504).json({
        message: 'Database query timed out',
        error: 'Request took too long to complete'
      });
    }
    
    if (error.name === 'MongooseError' && error.message.includes('buffering timed out')) {
      return res.status(503).json({
        message: 'Database connection timeout',
        error: 'Database is not responding. Please try again later.'
      });
    }
    
    res.status(500).json({ 
      message: 'Internal server error',
      error: error.message 
    });
  }
};

/**
 * Delete a PDF
 */
exports.deletePDF = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    // Find the PDF
    const resumePDF = await ResumePDF.findOne({ _id: id, userId });
    
    if (!resumePDF) {
      return res.status(404).json({ 
        message: 'PDF not found' 
      });
    }

    // Delete from Cloudinary
    const deleteResult = await deletePDF(resumePDF.cloudinaryPublicId);
    
    if (!deleteResult.success) {
      console.error('Failed to delete from Cloudinary:', deleteResult.error);
      // Continue with database deletion even if Cloudinary fails
    }

    // Delete from database
    await ResumePDF.findByIdAndDelete(id);

    res.json({
      message: 'PDF deleted successfully'
    });

  } catch (error) {
    console.error('Delete PDF error:', error);
    res.status(500).json({ 
      message: 'Internal server error',
      error: error.message 
    });
  }
};

/**
 * Test Cloudinary connection
 */
exports.testCloudinary = async (req, res) => {
  try {
    console.log('Testing Cloudinary connection...');
    
    // Test with a simple text file first
    const testContent = "This is a test file to verify Cloudinary connection.";
    const testBuffer = Buffer.from(testContent, 'utf8');
    
    console.log('Uploading test file...');
    const uploadResult = await uploadPDF(testBuffer, 'test.txt', 'test-user');
    
    if (uploadResult.success) {
      console.log('Test upload successful:', uploadResult.url);
      res.json({
        message: 'Cloudinary connection successful',
        data: {
          url: uploadResult.url,
          public_id: uploadResult.public_id,
          test_type: 'text_file'
        }
      });
    } else {
      console.error('Test upload failed:', uploadResult.error);
      res.status(500).json({
        message: 'Cloudinary connection failed',
        error: uploadResult.error
      });
    }
  } catch (error) {
    console.error('Cloudinary test error:', error);
    res.status(500).json({
      message: 'Cloudinary test failed',
      error: error.message
    });
  }
};

exports.downloadPDF = async (req, res) => {
  try {
    // Accept resumeData from request body (POST) or query (GET)
    const resumeData = req.body.resumeData || req.query.resumeData;
    if (!resumeData) {
      return res.status(400).json({ message: 'resumeData is required to generate PDF' });
    }
    // If resumeData is a string (from query), parse it
    const parsedResumeData = typeof resumeData === 'string' ? JSON.parse(resumeData) : resumeData;
    const pdfBuffer = await generateResumePDF(parsedResumeData);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=resume.pdf');
    res.send(pdfBuffer);
  } catch (error) {
    console.error('PDF download error:', error);
    res.status(500).json({ message: 'Failed to generate PDF', error: error.message });
  }
}; 