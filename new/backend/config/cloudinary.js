const cloudinary = require('cloudinary').v2;
const path = require('path');
const fs = require('fs');

// Configure Cloudinary
cloudinary.config({
  cloud_name: 'doapmsccx',
  api_key:    '349313895419472',
  api_secret: 'LxpSJg1keXXh-iadbmfFsmGpjJ0'
});

/**
 * Upload a PDF file to Cloudinary as a RAW resource
 * @param {Buffer} pdfBuffer
 * @param {string} fileName
 * @param {string} userId
 */
async function uploadPDF(pdfBuffer, fileName, userId) {
  // (Optional) Persist a local copy for debugging
  // try {
  //   const tmpDir = path.join(process.cwd(), 'resumes');
  //   if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir);
  //   fs.writeFileSync(path.join(tmpDir, fileName), pdfBuffer);
  // } catch (e) {
  //   console.warn('Local save failed:', e.message);
  // }

  // 2) Upload as a RAW resource
  const dataURI = `data:application/pdf;base64,${pdfBuffer.toString('base64')}`;
  const uploadRes = await cloudinary.uploader.upload(dataURI, {
    resource_type:   'raw',
    public_id:       `resumes/${userId}/${path.basename(fileName, '.pdf')}`,
    format:          'pdf',
    use_filename:    false,
    unique_filename: true,
    overwrite:       false,
    access_mode: 'public',
  });

  // 3) Immediately update access control to allow anonymous/public delivery
  await cloudinary.api.update(uploadRes.public_id, {
    resource_type: 'raw',
    access_control: [
      {
        access_type: 'anonymous',
        start:       0,
        end:         2147483647
      }
    ]
  });

  // 4) Return the final upload result
  return {
    public_id:   uploadRes.public_id,
    secure_url:  uploadRes.secure_url,
    bytes:       uploadRes.bytes
  };
}

/**
 * Delete a PDF from Cloudinary
 * @param {string} publicId
 */
async function deletePDF(publicId) {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: 'raw'                // <<— match resource_type
    });
    return { success: true, result };
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * List all user PDFs (raw resources only)
 * @param {string} userId
 */
async function getUserPDFs(userId) {
  try {
    const res = await cloudinary.search
      .expression(`folder:resume-builder/resumes/${userId} AND resource_type:raw`)
      .sort_by('created_at','desc')
      .max_results(50)
      .execute();

    return {
      success: true,
      pdfs: res.resources.map(r => ({
        id:         r.public_id,
        url:        r.secure_url,
        filename:   r.original_filename,
        created_at: r.created_at,
        size:       r.bytes
      }))
    };
  } catch (error) {
    console.error('Cloudinary search error:', error);
    return { success: false, error: error.message, pdfs: [] };
  }
}

/**
 * (Optional) Generate a signed URL for an authenticated raw PDF
 * @param {string} publicId
 * @param {number} [expiresIn=300] — seconds until URL expires
 */
function getSignedPDFUrl(publicId, expiresIn = 300) {
  return cloudinary.url(publicId, {
    resource_type: 'raw',
    sign_url:      true,
    type:          'authenticated',
    expires_at:    Math.floor(Date.now()/1000) + expiresIn
  });
}

module.exports = {
  uploadPDF,
  deletePDF,
  getUserPDFs,
  getSignedPDFUrl,
  cloudinary
};



// const cloudinary = require('cloudinary').v2;

// // Configure Cloudinary
// cloudinary.config({
//   cloud_name: 'doapmsccx',
//   api_key: '349313895419472',
//   api_secret: 'LxpSJg1keXXh-iadbmfFsmGpjJ0'
// });

// /**
//  * Upload a PDF file to Cloudinary
//  * @param {Buffer} pdfBuffer - The PDF file as a buffer
//  * @param {string} fileName - Name for the file
//  * @param {string} userId - User ID for organization
//  * @returns {Promise<Object>} Upload result with URL
//  */
// const uploadPDF = async (pdfBuffer, fileName, userId) => {
//   try {
//     // Convert buffer to base64
//     const base64PDF = pdfBuffer.toString('base64');
//     const dataURI = `data:application/pdf;base64,${base64PDF}`;

//     // Always use resource_type: 'raw' for PDFs
//     const result = await cloudinary.uploader.upload(dataURI, {
//       resource_type: 'auto',
//       format: 'pdf',
//       public_id: `resume-builder/resumes/${userId}/${fileName.replace(/\.pdf$/i, '')}`,
//       overwrite: true,
//       access_mode: 'public',
//       tags: ['resume', 'pdf', userId]
//     });

//     return {
//       success: true,
//       url: result.secure_url, // Always use secure_url
//       public_id: result.public_id,
//       filename: fileName
//     };
//   } catch (error) {
//     console.error('Cloudinary upload error:', error);
//     return {
//       success: false,
//       error: error.message
//     };
//   }
// };

// /**
//  * Delete a PDF file from Cloudinary
//  * @param {string} publicId - Cloudinary public ID
//  * @returns {Promise<Object>} Deletion result
//  */
// const deletePDF = async (publicId) => {
//   try {
//     const result = await cloudinary.uploader.destroy(publicId, {
//       resource_type: 'auto'
//     });
    
//     return {
//       success: true,
//       result
//     };
//   } catch (error) {
//     console.error('Cloudinary delete error:', error);
//     return {
//       success: false,
//       error: error.message
//     };
//   }
// };

// /**
//  * Get all PDFs for a user
//  * @param {string} userId - User ID
//  * @returns {Promise<Array>} List of PDFs
//  */
// const getUserPDFs = async (userId) => {
//   try {
//     const result = await cloudinary.search
//       .expression(`folder:resume-builder/resumes/${userId} AND resource_type:raw`)
//       .sort_by('created_at', 'desc')
//       .max_results(50)
//       .execute();

//     return {
//       success: true,
//       pdfs: result.resources.map(resource => ({
//         id: resource.public_id,
//         url: resource.secure_url,
//         filename: resource.original_filename,
//         created_at: resource.created_at,
//         size: resource.bytes
//       }))
//     };
//   } catch (error) {
//     console.error('Cloudinary search error:', error);
//     return {
//       success: false,
//       error: error.message,
//       pdfs: []
//     };
//   }
// };

// module.exports = {
//   uploadPDF,
//   deletePDF,
//   getUserPDFs,
//   cloudinary
// }; 