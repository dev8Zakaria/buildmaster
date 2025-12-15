import express from 'express';
import { isAdmin } from '../Midllewars/isRole.js';
import { authMidlleware } from '../Midllewars/authMidlleware.js';
import { 
    createCategory, 
    getAllCategories, 
    getCategoryById, 
    updateCategory, 
    deleteCategory 
} from '../Controllers/categoryController.js';

const router = express.Router();

// Routes Publiques
router.get('/', getAllCategories);
router.get('/:id', getCategoryById);

// Routes Admin (Pas d'upload d'image ici, donc pas de middleware multer)
router.post('/', [authMidlleware, isAdmin], createCategory);
router.put('/:id', [authMidlleware, isAdmin], updateCategory);
router.delete('/:id', [authMidlleware, isAdmin], deleteCategory);

export default router;