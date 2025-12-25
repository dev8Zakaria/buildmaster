import express from "express";
import { authMidlleware } from "../../Midllewars/authMidlleware.js";
import { isCustomer } from "../../Midllewars/isRole.js";
import {
  getCart,
  addToCart,
  buyNow,
  checkout,
} from "../../Controllers/client/cartController.js";

const router = express.Router();

router.get("/", [authMidlleware ,isCustomer], getCart);
router.post("/add", [authMidlleware, isCustomer], addToCart);
router.post("/buy-now", [authMidlleware, isCustomer], buyNow);
router.post("/checkout", [authMidlleware, isCustomer], checkout);
//router.patch("/item/:itemId",[authMidlleware, isCustomer], updateCartItemQty);
//router.delete("/item/:itemId",[authMidlleware, isCustomer], removeCartItem);




export default router;
