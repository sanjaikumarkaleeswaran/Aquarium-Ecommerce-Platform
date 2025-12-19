import { body, param, query, validationResult } from "express-validator";

// Middleware to check validation results
export const validate = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const formattedErrors = errors.array().reduce((acc, error) => {
            acc[error.path || error.param] = error.msg;
            return acc;
        }, {});

        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: formattedErrors
        });
    }

    next();
};

// User validation rules
export const userValidation = {
    register: [
        body("name")
            .trim()
            .notEmpty().withMessage("Name is required")
            .isLength({ min: 2, max: 100 }).withMessage("Name must be between 2 and 100 characters"),

        body("email")
            .trim()
            .notEmpty().withMessage("Email is required")
            .isEmail().withMessage("Please provide a valid email")
            .normalizeEmail(),

        body("password")
            .notEmpty().withMessage("Password is required")
            .isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),

        body("role")
            .notEmpty().withMessage("Role is required")
            .isIn(["customer", "retailer", "wholesaler", "admin"]).withMessage("Invalid role"),

        body("phone")
            .optional()
            .trim()
            .matches(/^[0-9]{10,15}$/).withMessage("Please provide a valid phone number"),

        // Retailer-specific validations (optional during registration)
        body("storeName")
            .optional()
            .trim(),

        body("businessName")
            .optional()
            .trim(),

        // Wholesaler-specific validations
        body("businessLicense")
            .optional()
            .trim()
    ],

    login: [
        body("email")
            .trim()
            .notEmpty().withMessage("Email is required")
            .isEmail().withMessage("Please provide a valid email")
            .normalizeEmail(),

        body("password")
            .notEmpty().withMessage("Password is required")
    ],

    updateProfile: [
        body("name")
            .optional()
            .trim()
            .isLength({ min: 2, max: 100 }).withMessage("Name must be between 2 and 100 characters"),

        body("phone")
            .optional()
            .trim()
            .matches(/^[0-9]{10,15}$/).withMessage("Please provide a valid phone number"),

        body("email")
            .optional()
            .trim()
            .isEmail().withMessage("Please provide a valid email")
            .normalizeEmail()
    ]
};

// Product validation rules
export const productValidation = {
    create: [
        body("name")
            .trim()
            .notEmpty().withMessage("Product name is required")
            .isLength({ min: 3, max: 200 }).withMessage("Product name must be between 3 and 200 characters"),

        body("category")
            .notEmpty().withMessage("Category is required")
            .isIn([
                "Marine Fish",
                "Fresh Water Fish",
                "Tanks",
                "Aquarium Accessories",
                "Fish Food",
                "Medicines",
                "Water Treatment",
                "Decorative Items",
                "Plants",
                "Filters & Pumps"
            ]).withMessage("Invalid category"),

        body("description")
            .trim()
            .notEmpty().withMessage("Description is required")
            .isLength({ min: 10 }).withMessage("Description must be at least 10 characters"),

        body("wholesalePrice")
            .notEmpty().withMessage("Wholesale price is required")
            .isFloat({ min: 0 }).withMessage("Wholesale price must be a positive number"),

        body("suggestedRetailPrice")
            .notEmpty().withMessage("Suggested retail price is required")
            .isFloat({ min: 0 }).withMessage("Suggested retail price must be a positive number"),

        body("stock")
            .notEmpty().withMessage("Stock quantity is required")
            .isInt({ min: 0 }).withMessage("Stock must be a non-negative integer"),

        body("minimumOrderQuantity")
            .optional()
            .isInt({ min: 1 }).withMessage("Minimum order quantity must be at least 1")
    ],

    update: [
        body("name")
            .optional()
            .trim()
            .isLength({ min: 3, max: 200 }).withMessage("Product name must be between 3 and 200 characters"),

        body("category")
            .optional()
            .isIn([
                "Marine Fish",
                "Fresh Water Fish",
                "Tanks",
                "Aquarium Accessories",
                "Fish Food",
                "Medicines",
                "Water Treatment",
                "Decorative Items",
                "Plants",
                "Filters & Pumps"
            ]).withMessage("Invalid category"),

        body("description")
            .optional()
            .trim()
            .isLength({ min: 10 }).withMessage("Description must be at least 10 characters"),

        body("wholesalePrice")
            .optional()
            .isFloat({ min: 0 }).withMessage("Wholesale price must be a positive number"),

        body("suggestedRetailPrice")
            .optional()
            .isFloat({ min: 0 }).withMessage("Suggested retail price must be a positive number"),

        body("stock")
            .optional()
            .isInt({ min: 0 }).withMessage("Stock must be a non-negative integer")
    ]
};

// Retailer product validation
export const retailerProductValidation = {
    create: [
        body("originalProduct")
            .notEmpty().withMessage("Original product ID is required")
            .isMongoId().withMessage("Invalid product ID"),

        body("quantity")
            .notEmpty().withMessage("Quantity is required")
            .isInt({ min: 1 }).withMessage("Quantity must be at least 1"),

        body("retailPrice")
            .notEmpty().withMessage("Retail price is required")
            .isFloat({ min: 0 }).withMessage("Retail price must be a positive number")
    ],

    updatePrice: [
        body("retailPrice")
            .notEmpty().withMessage("Retail price is required")
            .isFloat({ min: 0 }).withMessage("Retail price must be a positive number")
    ]
};

// Cart validation
export const cartValidation = {
    addItem: [
        body("productId")
            .notEmpty().withMessage("Product ID is required")
            .isMongoId().withMessage("Invalid product ID"),

        body("productType")
            .notEmpty().withMessage("Product type is required")
            .isIn(["Product", "RetailerProduct"]).withMessage("Invalid product type"),

        body("quantity")
            .notEmpty().withMessage("Quantity is required")
            .isInt({ min: 1 }).withMessage("Quantity must be at least 1")
    ],

    updateQuantity: [
        body("quantity")
            .notEmpty().withMessage("Quantity is required")
            .isInt({ min: 0 }).withMessage("Quantity must be a non-negative integer")
    ]
};

// Order validation
export const orderValidation = {
    create: [
        body("shippingAddress")
            .notEmpty().withMessage("Shipping address is required"),

        body("shippingAddress.name")
            .trim()
            .notEmpty().withMessage("Recipient name is required"),

        body("shippingAddress.phone")
            .trim()
            .notEmpty().withMessage("Phone number is required")
            .matches(/^[0-9]{10,15}$/).withMessage("Please provide a valid phone number"),

        body("shippingAddress.street")
            .trim()
            .notEmpty().withMessage("Street address is required"),

        body("shippingAddress.city")
            .trim()
            .notEmpty().withMessage("City is required"),

        body("shippingAddress.state")
            .trim()
            .notEmpty().withMessage("State is required"),

        body("shippingAddress.zipCode")
            .trim()
            .notEmpty().withMessage("Zip code is required"),

        body("paymentMethod")
            .notEmpty().withMessage("Payment method is required")
            .isIn(["credit-card", "debit-card", "paypal", "bank-transfer", "cash-on-delivery", "stripe"])
            .withMessage("Invalid payment method")
    ],

    updateStatus: [
        body("status")
            .notEmpty().withMessage("Status is required")
            .isIn(["pending", "confirmed", "processing", "shipped", "delivered", "cancelled", "refunded"])
            .withMessage("Invalid status")
    ]
};

// Admin validation
export const adminValidation = {
    approveUser: [
        param("userId")
            .notEmpty().withMessage("User ID is required")
            .isMongoId().withMessage("Invalid user ID")
    ],

    rejectUser: [
        param("userId")
            .notEmpty().withMessage("User ID is required")
            .isMongoId().withMessage("Invalid user ID"),

        body("reason")
            .trim()
            .notEmpty().withMessage("Rejection reason is required")
            .isLength({ min: 10 }).withMessage("Rejection reason must be at least 10 characters")
    ]
};

// ID parameter validation
export const idValidation = [
    param("id")
        .notEmpty().withMessage("ID is required")
        .isMongoId().withMessage("Invalid ID format")
];

export default {
    validate,
    userValidation,
    productValidation,
    retailerProductValidation,
    cartValidation,
    orderValidation,
    adminValidation,
    idValidation
};
