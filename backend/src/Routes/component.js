import express from 'express';
import { upload } from '../Midllewars/cloudinary.js';
import { isAdmin } from '../Midllewars/isRole.js';
import { authMidlleware } from '../Midllewars/authMidlleware.js';
import { 
    createComponent, 
    getAllComponents, 
    getComponentById,
    getComponentsByCategory,
    getRecentComponents,
    updateComponent, 
    deleteComponent 
} from '../Controllers/componentController.js';

const router = express.Router();

router.get('/recent',getRecentComponents);

// Routes Publiques
router.get('/', getAllComponents);
router.get('/:id', getComponentById);
router.get('/category/:categoryId',getComponentsByCategory);

// Routes Admin (Protégées)
router.post('/', [authMidlleware, isAdmin, upload.single('image')], createComponent);
router.put('/:id', [authMidlleware, isAdmin, upload.single('image')], updateComponent);
router.delete('/:id', [authMidlleware, isAdmin], deleteComponent);

export default router;