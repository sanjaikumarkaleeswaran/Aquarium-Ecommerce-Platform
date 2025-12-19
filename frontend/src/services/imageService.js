// Utility functions for handling image uploads and conversions

/**
 * Convert image file to base64 string
 * @param {File} file - Image file to convert
 * @returns {Promise<string>} Base64 encoded image string
 */
export const convertToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      resolve(event.target.result);
    };
    reader.onerror = (error) => {
      reject(error);
    };
    reader.readAsDataURL(file);
  });
};

/**
 * Convert multiple image files to base64 strings
 * @param {FileList} files - List of image files to convert
 * @returns {Promise<string[]>} Array of base64 encoded image strings
 */
export const convertMultipleToBase64 = async (files) => {
  const promises = Array.from(files).map(file => convertToBase64(file));
  return Promise.all(promises);
};

/**
 * Validate image file
 * @param {File} file - File to validate
 * @param {number} maxSizeMB - Maximum file size in MB (default: 5MB)
 * @returns {Object} Validation result with isValid and message
 */
export const validateImage = (file, maxSizeMB = 5) => {
  // Check if file is an image
  if (!file.type.startsWith('image/')) {
    return {
      isValid: false,
      message: 'File must be an image'
    };
  }
  
  // Check file size
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return {
      isValid: false,
      message: `File size must be less than ${maxSizeMB}MB`
    };
  }
  
  return {
    isValid: true,
    message: 'Valid image file'
  };
};

/**
 * Validate multiple image files
 * @param {FileList} files - List of files to validate
 * @param {number} maxSizeMB - Maximum file size in MB (default: 5MB)
 * @param {number} maxFiles - Maximum number of files (default: 5)
 * @returns {Object} Validation result with isValid and message
 */
export const validateMultipleImages = (files, maxSizeMB = 5, maxFiles = 5) => {
  // Check number of files
  if (files.length > maxFiles) {
    return {
      isValid: false,
      message: `You can upload a maximum of ${maxFiles} images`
    };
  }
  
  // Validate each file
  for (let i = 0; i < files.length; i++) {
    const validation = validateImage(files[i], maxSizeMB);
    if (!validation.isValid) {
      return validation;
    }
  }
  
  return {
    isValid: true,
    message: 'All files are valid'
  };
};

export default {
  convertToBase64,
  convertMultipleToBase64,
  validateImage,
  validateMultipleImages
};