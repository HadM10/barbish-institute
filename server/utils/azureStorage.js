const { v4: uuidv4 } = require('uuid');
const { imageContainer, videoContainer } = require('../config/azureStorage');

// Generate unique blob name
const generateBlobName = (originalname) => {
  const extension = originalname.split('.').pop();
  return `${uuidv4()}.${extension}`;
};

// Upload file to Azure Blob Storage
const uploadToAzure = async (container, file) => {
  try {
    const blobName = generateBlobName(file.originalname);
    const blockBlobClient = container.getBlockBlobClient(blobName);
    
    await blockBlobClient.upload(file.buffer, file.buffer.length, {
      blobHTTPHeaders: { blobContentType: file.mimetype }
    });

    return blockBlobClient.url;
  } catch (error) {
    console.error('Azure upload error:', error);
    throw new Error('Failed to upload file to Azure');
  }
};

module.exports = {
  uploadImage: (file) => uploadToAzure(imageContainer, file),
  uploadVideo: (file) => uploadToAzure(videoContainer, file)
};