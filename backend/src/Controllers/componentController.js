import prismaClient from '../Config/prisma.js';
import { removeImageFromCloudinary } from '../Midllewars/cloudinary.js';

// 1. CRÉER UN COMPOSANT (POST)
// ==========================================
export const createComponent = async (req, res) => {
    try {
        // Extraction des données
        // Attention : avec form-data, tout arrive en string !
        const { name, brand, price, stock, categoryId, specifications } = req.body;

        if (!req.file) {
            return res.status(400).json({ error: "L'image du composant est obligatoire." });
        }
        // Validation basique
        if (!categoryId) return res.status(400).json({ error: "La catégorie est obligatoire" });

        // Parsing des données (String -> Int/Json)
        let specsParsed = {};
        try {
            // specifications arrive comme une string '{"ram": "16gb"}'
            if (specifications) specsParsed = JSON.parse(specifications); 
        } catch (e) {
            return res.status(400).json({ error: "Format JSON invalide pour specifications" });
        }

        const componentData = {
            name,
            brand,
            price: parseFloat(price), // Conversion Decimal
            stock: parseInt(stock),   // Conversion Int
            categoryId: parseInt(categoryId), // Conversion Int
            specifications: specsParsed,
            ImageUrl: req.file ? req.file.path : null
        };

        const newComponent = await prismaClient.component.create({
            data: componentData
        });

        res.status(201).json({ message: "Composant créé", component: newComponent });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur lors de la création", details: error.message });
    }
};

// ==========================================
// 2. AFFICHER TOUS LES COMPOSANTS (GET)
// ==========================================
export const getAllComponents = async (req, res) => {
    try {
        const components = await prismaClient.component.findMany({
            include: { category: true } // On récupère aussi les infos de la catégorie liée
        });
        res.status(200).json(components);
    } catch (error) {
        res.status(500).json({ error: "Erreur récupération" });
    }
};

// ==========================================
// 3. AFFICHER UN SEUL COMPOSANT (GET BY ID)
// ==========================================
export const getComponentById = async (req, res) => {
    const { id } = req.params;
    try {
        const component = await prismaClient.component.findUnique({
            where: { id: id }, // id est un String (UUID) maintenant
            include: { category: true }
        });

        if (!component) return res.status(404).json({ message: "Composant introuvable" });

        res.status(200).json(component);
    } catch (error) {
        res.status(500).json({ error: "Erreur récupération" });
    }
};


// ================ component par catégorie 
export const getComponentsByCategory = async (req, res) => {
    const { categoryId } = req.params;

    try {
        const components = await prismaClient.component.findMany({ 
            where: { 
                categoryId: parseInt(categoryId) 
            },
            include: { category: true }
        });

        
        if (components.length === 0) {
            return res.status(404).json({ message: "Aucun composant trouvé pour cette catégorie" });
        }

        res.status(200).json(components);
    } catch (error) {
        console.error(error); // Important pour voir l'erreur dans le terminal
        res.status(500).json({ error: "Erreur lors de la récupération par catégorie" });
    }
};

//========================les 10 derniers components 
export const getRecentComponents = async (req, res) => {
    try {
        const recentComponents = await prismaClient.component.findMany({
            // 1. Trier par date de création (descendant = du plus récent au plus vieux)
            orderBy: {
                createdAt: 'desc' 
            },
            // 2. Limiter à 10 résultats
            take: 10,
            
            // 3. (Optionnel) Filtrer pour ne prendre que les produits actifs
            where: {
                isActive: true
            },
            
            // 4. Inclure la catégorie pour l'affichage
            include: {
                category: true
            }
        });

        res.status(200).json(recentComponents);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur lors de la récupération des nouveautés" });
    }
};

// ==========================================
// 4. MODIFIER UN COMPOSANT (PUT)
// ==========================================
export const updateComponent = async (req, res) => {
    const { id } = req.params; // String UUID
    const { name, brand, price, stock, categoryId, specifications, isActive } = req.body;

    try {
        const existingComponent = await prismaClient.component.findUnique({ where: { id } });
        if (!existingComponent) return res.status(404).json({ message: "Composant introuvable" });

        // Préparation des données à modifier
        let updateData = {};
        if (name) updateData.name = name;
        if (brand) updateData.brand = brand;
        if (price) updateData.price = parseFloat(price);
        if (stock) updateData.stock = parseInt(stock);
        if (categoryId) updateData.categoryId = parseInt(categoryId);
        if (isActive !== undefined) updateData.isActive = (isActive === 'true'); // form-data envoie des strings

        // Parsing JSON pour specifications
        if (specifications) {
            try {
                updateData.specifications = JSON.parse(specifications);
            } catch (e) {
                return res.status(400).json({ error: "Invalid JSON in specifications" });
            }
        }

        // Gestion Image
        if (req.file) {
            await removeImageFromCloudinary(existingComponent.ImageUrl);
            updateData.ImageUrl = req.file.path;
        }

        const updatedComponent = await prismaClient.component.update({
            where: { id },
            data: updateData
        });

        res.status(200).json({ message: "Mise à jour réussie", component: updatedComponent });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur mise à jour" });
    }
};

// ==========================================
// 5. SUPPRIMER UN COMPOSANT (DELETE)
// ==========================================
export const deleteComponent = async (req, res) => {
    const { id } = req.params;

    try {
        const existingComponent = await prismaClient.component.findUnique({ where: { id } });
        if (!existingComponent) return res.status(404).json({ message: "Composant introuvable" });

        // 1. Supprimer l'image du Cloud
        await removeImageFromCloudinary(existingComponent.ImageUrl);

        // 2. Supprimer de la DB
        await prismaClient.component.delete({ where: { id } });

        res.status(200).json({ message: "Composant supprimé" });

    } catch (error) {
        // Gestion erreur clé étrangère (si le composant est déjà dans une commande)
        if (error.code === 'P2003') {
            return res.status(400).json({ error: "Impossible de supprimer ce composant car il est lié à une commande." });
        }
        res.status(500).json({ error: "Erreur suppression" });
    }
};