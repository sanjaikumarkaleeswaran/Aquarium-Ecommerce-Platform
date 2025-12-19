import express from "express";
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getMyProducts,
  getCategories,
  updateStock
} from "../controllers/productController.js";
import { authenticate, authorize, wholesalerOnly, checkApproval } from "../middleware/auth.js";
import { productValidation, idValidation, validate } from "../middleware/validation.js";

const router = express.Router();

// Public routes
router.get("/", getAllProducts);
router.get("/search", getAllProducts); // Alias for compatibility - uses query params
router.get("/categories", getCategories);
router.get("/wholesaler/:wholesalerId", async (req, res) => {
  // Compatibility route - redirect to main products with filter
  req.query.wholesaler = req.params.wholesalerId;
  return getAllProducts(req, res);
});
router.get("/:id", getProductById);

// Wholesaler routes (protected)
router.post(
  "/",
  authenticate,
  authorize("wholesaler", "retailer"),
  checkApproval,
  productValidation.create,
  validate,
  createProduct
);

router.get(
  "/my-products/list",
  authenticate,
  authorize("wholesaler", "retailer"),
  checkApproval,
  getMyProducts
);

// Alias for frontend compatibility
router.get(
  "/my/products",
  authenticate,
  authorize("wholesaler", "retailer"),
  checkApproval,
  getMyProducts
);

router.put(
  "/:id",
  authenticate,
  authorize("wholesaler", "retailer"),
  checkApproval,
  productValidation.update,
  validate,
  updateProduct
);

router.delete(
  "/:id",
  authenticate,
  authorize("wholesaler", "retailer"),
  checkApproval,
  deleteProduct
);

router.put(
  "/:id/stock",
  authenticate,
  authorize("wholesaler", "retailer"),
  checkApproval,
  updateStock
);

export default router;