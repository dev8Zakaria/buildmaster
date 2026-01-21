import express from "express";
import { authMidlleware } from "../../Midllewars/authMidlleware.js";
import { isCustomer } from "../../Midllewars/isRole.js";
import { transferBuildToOrder } from "../../Controllers/client/addBuildToCart.js";
import {
  getAllSavedBuilds,
  getSavedBuildById,
  updateSavedBuild,
  deleteSavedBuild
} from "../../Controllers/client/SavedBuildController.js";
import {
  getComponentsForStep,
  saveCompleteBuild
} from "../../Controllers/client/pcBuilderController.js";

// Public : Tout le monde peut voir les composants pour tester le configurateur
router.get('/step/:categoryName', getComponentsForStep);

// Toutes les routes ci-dessous nécessitent d'être connecté ET d'être un "Customer"
router.use(authMidlleware);
router.use(isCustomer);

// Protégé : Seul un client connecté peut sauvegarder son build final
router.post('/save', saveCompleteBuild);

// Liste légère des builds de l'utilisateur
router.get('/', getAllSavedBuilds);

// Détails d'un build spécifique
router.get('/:id', getSavedBuildById);

// Mise à jour d'un build
router.put('/:id', updateSavedBuild);

// Suppression d'un build
router.delete('/:id', deleteSavedBuild);

// Transfert vers le panier
router.post('/:buildId/transfer', transferBuildToOrder);

module.exports = router;