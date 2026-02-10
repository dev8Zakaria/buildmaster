import express from "express";
import { authMidlleware } from "../../Midllewars/authMidlleware.js";
import { isCustomer } from "../../Midllewars/isRole.js";
import {
  getCart,
  addToCart,
  buyNow,
  checkout,
  updateCartItemQty, // Import ajouté
  removeCartItem,    // Import ajouté
} from "../../Controllers/client/cartController.js";
import { transferBuildToOrder } from "../../Controllers/client/addBuildToCart.js"; // Import pour le transfert de build

const router = express.Router();

// Middleware de base pour toutes les routes du panier (Auth + Client)
const protect = [authMidlleware, isCustomer];

// --- Gestion du Panier ---
router.get("/", protect, getCart);
router.post("/add", protect, addToCart);
router.post("/buy-now", protect, buyNow);
router.post("/checkout", protect, checkout);

// --- Modification et Suppression (Décommentés et activés) ---
router.patch("/item/:itemId", protect, updateCartItemQty); // Modifier la quantité (+/-)
router.delete("/item/:itemId", protect, removeCartItem);   // Supprimer un article du panier

// --- Transfert (Build -> Panier) ---
// Transfère une configuration sauvegardée (PC Builder) vers le panier
router.post("/transfer-build/:buildId", protect, transferBuildToOrder);

export default router;