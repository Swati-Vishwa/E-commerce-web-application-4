import { Router } from "express";
import { getProducts, getCategories, getProduct, createProduct, updateProduct, deleteProduct } from "../controllers/product.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { adminOnly } from "../middleware/admin.middleware.js";

const router = Router();

router.get("/categories", getCategories);
router.route("/").get(getProducts).post(protect, adminOnly, createProduct);
router
  .route("/:id")
  .get(getProduct)
  .put(protect, adminOnly, updateProduct)
  .delete(protect, adminOnly, deleteProduct);

export default router