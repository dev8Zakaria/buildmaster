import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';


dotenv.config();

// Configuration Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// --- FONCTION DE SUPPRESSION (Version Regex Robuste) ---
export const removeImageFromCloudinary = async (imageUrl) => {
    if (!imageUrl) return;

    try {
        // Regex pour extraire le public_id
        // Elle cherche ce qui est après "/upload/"
        // Elle ignore la partie "v123456/" (version) si elle existe
        // Elle capture tout jusqu'au point de l'extension (.jpg)
        const regex = /\/upload\/(?:v\d+\/)?(.+)\.[a-zA-Z]+$/;
        const match = imageUrl.match(regex);

        if (match && match[1]) {
            const publicId = match[1];
            console.log(`Suppression Cloudinary ID : ${publicId}`); // Debug

            await cloudinary.uploader.destroy(publicId);
        } else {
            console.log("Impossible d'extraire l'ID Cloudinary de l'URL :", imageUrl);
        }

    } catch (error) {
        console.error("Erreur lors de la suppression Cloudinary :", error);
    }
};

// Configuration du stockage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'pc-store-products',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
  },
});

export const upload = multer({ storage: storage });
