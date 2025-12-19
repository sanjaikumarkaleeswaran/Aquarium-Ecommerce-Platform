import express from "express";
import {
    purchaseFromWholesaler,
    addCatalogItem,
    getMyInventory,
    browseRetailerProducts,
    getRetailerProductById,
    updateRetailerProduct,
    deleteRetailerProduct,
    getRetailerAnalytics
} from "../controllers/retailerProductController.js";
import { authenticate, retailerOnly, checkApproval } from "../middleware/auth.js";
import { retailerProductValidation, idValidation, validate } from "../middleware/validation.js";

const router = express.Router();

// Public routes (for customers to browse)
router.get("/browse", browseRetailerProducts);
router.get("/:id", getRetailerProductById);

// Retailer routes (protected)
router.post(
    "/purchase",
    authenticate,
    retailerOnly,
    checkApproval,
    purchaseFromWholesaler
);

router.post(
    "/add-catalog-item",
    authenticate,
    retailerOnly,
    checkApproval,
    addCatalogItem
);

router.get(
    "/my-inventory/list",
    authenticate,
    retailerOnly,
    checkApproval,
    getMyInventory
);

router.get(
    "/analytics/sales",
    authenticate,
    retailerOnly,
    checkApproval,
    getRetailerAnalytics
);

router.put(
    "/:id",
    authenticate,
    retailerOnly,
    checkApproval,
    updateRetailerProduct
);

router.delete(
    "/:id",
    authenticate,
    retailerOnly,
    checkApproval,
    deleteRetailerProduct
);

export default router;
