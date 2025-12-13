import express from 'express';
import { upload } from '../Midllewars/cloudinary.js'; // Import nommé
import { isAdmin } from '../Midllewars/isRole.js'
import { authMidlleware } from '../Midllewars/authMidlleware.js';
import { createProduct,updateProduct,deleteProduct,getAllProducts } from '../Controllers/productController.js';

const router = express.Router();

// Route POST : http://localhost:3000/api/products
// 'image' est le nom du champ (key) que tu devras utiliser dans le Frontend ou Postman
router.get('/', getAllProducts);


// --- ROUTES PROTEGEES (ADMIN) ---
// POST : Créer (déjà fait)
router.post('/', [authMidlleware, isAdmin, upload.single('image')], createProduct);

// PUT : Modifier (ID requis + Token Admin + Image optionnelle)
router.put('/:id', [authMidlleware, isAdmin, upload.single('image')], updateProduct);

// DELETE : Supprimer (ID requis + Token Admin)
router.delete('/:id', [authMidlleware, isAdmin], deleteProduct);
export default router;