import express from "express";
import { authMidlleware } from "../../Midllewars/authMidlleware.js";
import { isCustomer } from "../../Midllewars/isRole.js";
import { getMyPaidOrders, getMyPaidOrderById } from "../../Controllers/client/orderController.js";

const router = express.Router();

router.get("/me", authMidlleware, isCustomer, getMyPaidOrders);
router.get("/:id", authMidlleware, isCustomer, getMyPaidOrderById);

export default router;
