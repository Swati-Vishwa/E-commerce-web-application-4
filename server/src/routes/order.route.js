import { Router } from "express";
import { createOrder, getAllOrders, getMyOrders, updateOrderStatus } from "../controllers/order.controller.js";
import { adminOnly } from "../middleware/admin.middleware.js";
import { protect } from "../middleware/auth.middleware.js";

const router = Router();

router.use(protect)
router.post('/', createOrder);
router.get('/my', getMyOrders);
router.get('/', adminOnly, getAllOrders);
router.put('/:id/status', adminOnly, updateOrderStatus)

export default router;