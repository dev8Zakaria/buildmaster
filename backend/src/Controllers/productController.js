import prismaClient from '../Config/prisma.js';
import { removeImageFromCloudinary } from '../Midllewars/cloudinary.js';


export const createProduct = async (req, res) => {
  try {
    // 1. Vérifier si une image a bien été uploadée
    if (!req.file) {
      return res.status(400).json({ error: "L'image est obligatoire." });
    }

    // 2. Récupérer les données du formulaire
    const { name, description, price } = req.body;

    // 3. Récupérer l'URL sécurisée renvoyée par Cloudinary
    const imageUrl = req.file.path; 

    // 4. Création dans la base de données via Prisma
    // Attention: 'price' arrive en String, il faut le convertir en Float
    const newProduct = await prismaClient.product.create({
      data: {
        name: name,
        description: description,
        price: parseFloat(price), // Conversion obligatoire pour ton schema Float
        ImageUrl: imageUrl,       // Correspond exactement à ton champ 'ImageUrl'
      },
    });

    return res.status(201).json({
      message: "Produit créé avec succès",
      product: newProduct
    });

  } catch (error) {
    console.error("Erreur lors de la création du produit:", error);
    
    // Gestion spécifique de l'erreur "Unique constraint" sur ImageUrl
    if (error.code === 'P2002') {
       return res.status(409).json({ error: "Cette image existe déjà (URL unique)." });
    }

    return res.status(500).json({ error: "Erreur serveur lors de la création." });
  }
};
export const getAllProducts = async (req, res) => {
    try {
        const products = await prismaClient.product.findMany();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de la récupération des produits" });
    }
};

// 2. MODIFIER UN PRODUIT (Admin)
export const updateProduct = async (req, res) => {
    const { id } = req.params;
    const { name, description, price } = req.body;

    try {
        // 1. Récupérer le produit actuel pour avoir l'ancienne URL
        const existingProduct = await prismaClient.product.findUnique({ where: { id } });
        
        if (!existingProduct) {
            return res.status(404).json({ message: "Produit non trouvé" });
        }

        let updateData = {
            name,
            description,
            price: price ? parseFloat(price) : undefined
        };

        // 2. SI une nouvelle image est envoyée
        if (req.file) {
            // A. Supprimer l'ancienne image du Cloud
            await removeImageFromCloudinary(existingProduct.ImageUrl);
            
            // B. Mettre la nouvelle URL
            updateData.ImageUrl = req.file.path;
        }

        const updatedProduct = await prismaClient.product.update({
            where: { id },
            data: updateData
        });

        res.status(200).json({ message: "Produit modifié", product: updatedProduct });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur lors de la modification" });
    }
};

// 3. SUPPRIMER UN PRODUIT (Admin)
export const deleteProduct = async (req, res) => {
    const { id } = req.params;

    try {
        // 1. Trouver le produit pour avoir l'URL de l'image
        const existingProduct = await prismaClient.product.findUnique({ where: { id } });

        if (!existingProduct) {
            return res.status(404).json({ message: "Produit non trouvé" });
        }

        // 2. Supprimer l'image de Cloudinary
        await removeImageFromCloudinary(existingProduct.ImageUrl);

        // 3. Supprimer le produit de la Base de Données
        await prismaClient.product.delete({
            where: { id }
        });

        res.status(200).json({ message: "Produit et image supprimés avec succès" });

    } catch (error) {
        console.error(error); // Utile pour voir l'erreur dans le terminal
        res.status(500).json({ error: "Erreur lors de la suppression" });
    }
};