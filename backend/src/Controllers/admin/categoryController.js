import prismaClient from '../../Config/prisma.js';

// ==========================================
// 1. CRÉER UNE CATÉGORIE
// ==========================================
export const createCategory = async (req, res) => {
    const { name, description } = req.body;

    try {
        if (!name) {
            return res.status(400).json({ error: "Le nom de la catégorie est obligatoire" });
        }

        // Vérifier si la catégorie existe déjà (car name est @unique)
        const existingCategory = await prismaClient.category.findUnique({
            where: { name }
        });

        if (existingCategory) {
            return res.status(400).json({ error: "Cette catégorie existe déjà" });
        }

        const newCategory = await prismaClient.category.create({
            data: {
                name,
                description
            }
        });

        res.status(201).json({ message: "Catégorie créée", category: newCategory });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur serveur" });
    }
};

// ==========================================
// 2. AFFICHER TOUTES LES CATÉGORIES
// ==========================================
export const getAllCategories = async (req, res) => {
    try {
        const categories = await prismaClient.category.findMany({
            // Optionnel : inclure le nombre de composants dans chaque catégorie
            include: {
                _count: {
                    select: { components: true }
                }
            }
        });
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ error: "Erreur récupération" });
    }
};

// ==========================================
// 3. AFFICHER UNE CATÉGORIE (AVEC SES COMPOSANTS)
// ==========================================
export const getCategoryById = async (req, res) => {
    const { id } = req.params;

    try {
        const category = await prismaClient.category.findUnique({
            where: { id: parseInt(id) }, // Attention: ID est un Int
            include: {
                components: true // On récupère la liste des produits de cette catégorie
            }
        });

        if (!category) return res.status(404).json({ message: "Catégorie introuvable" });

        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ error: "Erreur récupération" });
    }
};

// ==========================================
// 4. MODIFIER UNE CATÉGORIE
// ==========================================
export const updateCategory = async (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;

    try {
        const updatedCategory = await prismaClient.category.update({
            where: { id: parseInt(id) },
            data: { name, description }
        });

        res.status(200).json({ message: "Catégorie mise à jour", category: updatedCategory });

    } catch (error) {
        // Erreur P2025 : Record not found
        if (error.code === 'P2025') {
            return res.status(404).json({ message: "Catégorie introuvable" });
        }
        res.status(500).json({ error: "Erreur mise à jour" });
    }
};

// ==========================================
// 5. SUPPRIMER UNE CATÉGORIE
// ==========================================
export const deleteCategory = async (req, res) => {
    const { id } = req.params;

    try {
        await prismaClient.category.delete({
            where: { id: parseInt(id) }
        });

        res.status(200).json({ message: "Catégorie supprimée" });

    } catch (error) {
        // Erreur P2003 : Contrainte de clé étrangère (La catégorie contient des produits)
        if (error.code === 'P2003') {
            return res.status(400).json({ 
                error: "Impossible de supprimer cette catégorie car elle contient des composants. Supprimez ou déplacez les composants d'abord." 
            });
        }
        if (error.code === 'P2025') {
            return res.status(404).json({ message: "Catégorie introuvable" });
        }
        res.status(500).json({ error: "Erreur suppression" });
    }
};