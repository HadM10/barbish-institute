const { BlobServiceClient } = require('@azure/storage-blob');
require('dotenv').config();

const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);

// Container clients
const imageContainer = blobServiceClient.getContainerClient('images');
const videoContainer = blobServiceClient.getContainerClient('videos');

module.exports = {
  imageContainer,
  videoContainer,
  blobServiceClient
};