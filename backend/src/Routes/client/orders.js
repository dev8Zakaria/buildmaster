import express from "express";
import { authMidlleware } from "../../Midllewars/authMidlleware.js";
import { isCustomer, isAdmin } from "../../Midllewars/isRole.js"; // J'ai ajouté isAdmin
import {
    getMyPaidOrders,
    getMyPaidOrderById,
    getAllOrdersAdmin,
    getAdminStats
} from "../../Controllers/client/orderController.js";

const router = express.Router();

// --- ROUTES ADMIN ---
// Doit être placée AVANT "/:id" sinon Express croira que "admin" est un ID
router.get("/admin/all", [authMidlleware, isAdmin], getAllOrdersAdmin);
router.get("/admin/stats", [authMidlleware, isAdmin], getAdminStats);


// --- ROUTES CLIENT ---
// Historique de l'utilisateur connecté
router.get("/me", [authMidlleware, isCustomer], getMyPaidOrders);

// Détail d'une commande spécifique
router.get("/:id", [authMidlleware, isCustomer], getMyPaidOrderById);

export default router;