import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';

// Charger les variables d'environnement
dotenv.config();

// --- FONCTION D'AIDE AMÉLIORÉE ---
export const removeImageFromCloudinary = async (imageUrl) => {
    if (!imageUrl) return;

    try {
        // 1. On récupère tout ce qui se trouve APRÈS "/upload/"
        const splitUrl = imageUrl.split('/upload/');
        
        // Sécurité : si ce n'est pas une URL Cloudinary valide
        if (splitUrl.length < 2) return; 

        // Ex: "v1765656935/pc-store-products/qhfkumesildvw51vtyvq.jpg"
        let path = splitUrl[1];

        // 2. On découpe par "/"
        let parts = path.split('/');

        // 3. Si le premier morceau est une version (commence par 'v' suivi de chiffres), on l'enlève
        // C'est souvent ça qui bloquait la suppression !
        if (parts[0].startsWith('v') && !isNaN(parts[0].substr(1))) {
            parts.shift();
        }

        // 4. On rejoint les morceaux restants (dossier + nom) et on retire l'extension (.jpg)
        // join('/') remet le dossier s'il y en a un
        const publicId = parts.join('/').split('.')[0];

        // LOG DE DEBUG : Regardez votre terminal pour voir si l'ID est correct
        console.log(`Tentative de suppression Cloudinary. Public ID : ${publicId}`);

        // 5. Suppression
        const result = await cloudinary.uploader.destroy(publicId);
        
        console.log("Résultat suppression :", result); // Doit afficher { result: 'ok' }

    } catch (error) {
        console.error("Erreur lors de la suppression Cloudinary :", error);
    }
};

// Configuration Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configuration du stockage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'pc-store-products', // Le nom du dossier dans ton Cloudinary
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
  },
});

// Export du middleware upload
export const upload = multer({ storage: storage });