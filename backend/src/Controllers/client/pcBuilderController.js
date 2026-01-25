import prisma from "../../Config/prisma.js";
import { Prisma } from "@prisma/client";

export const getComponentsForStep = async (req, res) => {
  try {
    const { categoryName } = req.params;
    // Récupération des IDs déjà sélectionnés envoyés par le frontend
    const { cpuId, moboId, gpuId } = req.query;

    let filters = {
      category: { name: { equals: categoryName, mode: 'insensitive' } },
      isActive: true,
      stock: { gt: 0 }
    };

    // --- LOGIQUE DE COMPATIBILITÉ ---

    const cat = categoryName.toLowerCase();

    // Étape 2 : Filtrer les Cartes Mères par rapport au CPU
    if ((cat === 'motherboard' || cat === 'cartes mères') && cpuId) {
      const cpu = await prisma.component.findUnique({ where: { id: cpuId } });
      if (cpu) {
        filters.specifications = { path: ['socket'], equals: cpu.specifications.socket };
      }
    }

    // Étape 3 : Filtrer la RAM par rapport à la Carte Mère
    if ((cat === 'ram' || cat === 'mémoire ram') && moboId) {
      const mobo = await prisma.component.findUnique({ where: { id: moboId } });
      if (mobo) {
        filters.specifications = { path: ['type'], equals: mobo.specifications.memoryType };
      }
    }

    // Étape 6 : Filtrer l'Alimentation par rapport au CPU + GPU
    if ((cat === 'psu' || cat === 'alimentation') && cpuId && gpuId) {
      const cpu = await prisma.component.findUnique({ where: { id: cpuId } });
      const gpu = await prisma.component.findUnique({ where: { id: gpuId } });
      if (cpu && gpu) {
        const minWattage = (cpu.specifications.tdp + gpu.specifications.tdp) * 1.5;
        filters.specifications = { path: ['wattage'], gte: minWattage };
      }
    }

    // Étape 7 : Filtrer le Boîtier par rapport à la Carte Mère + GPU
    if ((cat === 'case' || cat === 'boîtiers') && moboId && gpuId) {
      const mobo = await prisma.component.findUnique({ where: { id: moboId } });
      const gpu = await prisma.component.findUnique({ where: { id: gpuId } });
      if (mobo && gpu) {
        filters.AND = [
          { specifications: { path: ['motherboardSupport'], array_contains: mobo.specifications.formFactor } },
          { specifications: { path: ['maxGPULength'], gte: gpu.specifications.length } }
        ];
      }
    }

    const components = await prisma.component.findMany({
      where: filters,
      include: { category: true }
    });

    res.status(200).json(components);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors du filtrage des composants." });
  }
};

/*
export const getComponentsForStep = async (req, res) => {
  try {
    const { categoryName } = req.params; // ex: "CPU", "GPU", "RAM"

    const components = await prisma.component.findMany({
      where: {
        category: {
          name: { equals: categoryName, mode: 'insensitive' }
        },
        isActive: true,
        stock: { gt: 0 }
      },
      select: {
        id: true,
        name: true,
        brand: true,
        price: true,
        ImageUrl: true,
        specifications: true // Contient le Socket, TDP, etc., pour l'affichage
      }
    });

    if (components.length === 0) {
      return res.status(404).json({ message: `Aucun composant trouvé pour la catégorie ${categoryName}` });
    }

    res.status(200).json(components);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des composants." });
  }
}; 
*/

export const saveCompleteBuild = async (req, res) => {
  try {
    const { name, componentIds } = req.body;
    const userId = req.user.id; // Extrait du token JWT

    // 1. Vérification et récupération des prix actuels en DB
    const selectedComponents = await prisma.component.findMany({
      where: { id: { in: componentIds } }
    });

    // 2. Calcul sécurisé du prix total côté serveur
    const totalPrice = selectedComponents.reduce(
      (acc, comp) => acc.add(comp.price),
      new Prisma.Decimal(0)
    );

    // 3. Création du SavedBuild avec les relations
    const newBuild = await prisma.savedBuild.create({
      data: {
        name: name,
        total_price: totalPrice,
        userId: userId,
        components: {
          connect: componentIds.map(id => ({ id }))
        }
      }
    });

    res.status(201).json({ message: "Build sauvegardé !", data: newBuild });
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ message: "Un build avec ce nom existe déjà pour votre compte." });
    }
    res.status(500).json({ message: "Erreur serveur lors de la sauvegarde." });
  }
};

