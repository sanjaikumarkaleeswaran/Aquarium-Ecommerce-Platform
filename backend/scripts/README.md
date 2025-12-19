# Product Image Management Scripts

This directory contains scripts for managing product images in the Aquarium Commerce application.

## Scripts

### 1. uploadFolderPreserveImages.js
Uploads images from a folder while preserving existing images for products that already exist.

**Usage:**
```bash
node uploadFolderPreserveImages.js <folder-path> <category>
```

**Example:**
```bash
node uploadFolderPreserveImages.js ./fish-images "Marine Fish"
```

**Features:**
- Checks if a product with the same name already exists
- Preserves existing images when a product is found
- Creates new products with images when no existing product is found
- Supports common image formats: JPG, JPEG, PNG, GIF, WEBP

### 2. ensureAllProductsHaveImages.js
Ensures all products in the database have images, preserving existing ones.

**Usage:**
```bash
node ensureAllProductsHaveImages.js
```

### 4. recoverOriginalProducts.js
Recovers and displays information about original products with their images in categories excluding fish.

**Usage:**
```bash
node recoverOriginalProducts.js
```

### 6. displayAllProducts.js
Displays all products grouped by category with information about their images.

**Usage:**
```bash
node displayAllProducts.js
```

### 7. removeDuplicates.js
Removes duplicate products while preserving the ones with original images.

**Usage:**
```bash
node removeDuplicates.js
```

### 8. restoreOriginalImages.js
Restores original product images from a folder structure organized by category.

**Usage:**
```bash
node restoreOriginalImages.js <path-to-original-images-folder>
```

**Example:**
```bash
node restoreOriginalImages.js ./original-images
```

### 9. updateMandarinGobyImage.js
Updates the image for the specific "Mandarin Goby" product in the "Marine Fish" category.

**Usage:**
```bash
node updateMandarinGobyImage.js <image-file-path>
```

**Example:**
```bash
node updateMandarinGobyImage.js ./mandarin-goby.jpg
```

### 10. verifyMandarinGobyImage.js
Verifies that the "Mandarin Goby" product has the correct image.

**Usage:**
```bash
node verifyMandarinGobyImage.js
```

### 11. updateMandarinGobyWithUrl.js
Updates the "Mandarin Goby" product with a specific image URL.

**Usage:**
```bash
node updateMandarinGobyWithUrl.js
```

## How Image Preservation Works

1. When adding new products, the system first checks if a product with the same name and category already exists
2. If an existing product is found with images, those original images are automatically reused for ALL categories
3. If no existing product is found, new images are added
4. During updates, if no new images are provided, original images are reused
5. Duplicate products are identified and consolidated to preserve original images
6. Products with more images are prioritized during consolidation
7. Existing products are updated with new information while preserving their original images

## Image Storage

Images are stored as base64 encoded strings in the database for simplicity. In a production environment, you might want to:
- Store images on a CDN
- Save image URLs instead of base64 data
- Implement proper image compression and optimization


# Customer (auto-approved)
Email: customer@test.com
Password: test123
Role: customer
→ Can login immediately ✅

# Retailer (needs approval)
Email: retailer@test.com
Password: test123
Role: retailer
→ Pending approval ⏳

# Wholesaler (needs approval)
Email: wholesaler@test.com
Password: test123
Role: wholesaler
→ Pending approval ⏳

# Admin (auto-approved)
Email: admin@test.com
Password: test123
Role: admin
→ Can login immediately ✅