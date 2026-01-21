import prisma from "../../Config/prisma.js";
import { Prisma } from "@prisma/client";

export const getAllSavedBuilds = async (req, res) => {
  try {
    const userId = req.user.id;

    const builds = await prisma.savedBuild.findMany({
      where: {
        userId: userId
      },
      select: {
        name: true,
        total_price: true,
        createdAt: true
        // On ne sélectionne PAS 'id' ou 'components' ici pour alléger la réponse
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return res.status(200).json(builds);
  } catch (error) {
    return res.status(500).json({ message: "Erreur lors de la récupération de la liste." });
  }
};

export const getSavedBuildById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id; // Récupéré via votre middleware d'auth

    const build = await prisma.savedBuild.findFirst({
      where: {
        id: parseInt(id),
        userId: userId // Sécurité : vérifie que le build appartient bien à l'utilisateur
      },
      include: {
        components: true // Récupère tous les détails des composants associés
      }
    });

    if (!build) {
      return res.status(404).json({ message: "Build non trouvé ou accès refusé." });
    }

    return res.status(200).json(build);
  } catch (error) {
    return res.status(500).json({ message: "Erreur lors de la récupération du build." });
  }
};

export const updateSavedBuild = async (req, res) => {
  try {
    const { id } = req.params; // L'ID du build à modifier
    const { name, componentIds } = req.body; // Les nouvelles données
    const userId = req.user.id;

    // 1. Vérifier si le build existe et appartient à l'utilisateur
    const existingBuild = await prisma.savedBuild.findFirst({
      where: {
        id: parseInt(id),
        userId: userId
      }
    });

    if (!existingBuild) {
      return res.status(404).json({ message: "Build non trouvé ou accès refusé." });
    }

    // 2. Récupérer les nouveaux composants pour recalculer le prix total
    const components = await prisma.component.findMany({
      where: { id: { in: componentIds } }
    });

    const newTotalPrice = components.reduce(
      (acc, comp) => acc.add(comp.price), 
      new Prisma.Decimal(0)
    );

    // 3. Mettre à jour le build et ses relations
    const updatedBuild = await prisma.savedBuild.update({
      where: { id: parseInt(id) },
      data: {
        name: name,
        total_price: newTotalPrice,
        components: {
          // 'set' vide la liste actuelle et la remplace par la nouvelle liste d'IDs
          set: componentIds.map(id => ({ id }))
        }
      },
      include: {
        components: true // Pour renvoyer le build mis à jour avec les nouveaux composants
      }
    });

    res.status(200).json({
      message: "Build mis à jour avec succès",
      data: updatedBuild
    });

  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ message: "Un autre de vos builds porte déjà ce nom." });
    }
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la modification du build." });
  }
};

export const deleteSavedBuild = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id; // ID de l'utilisateur extrait du token

    // 1. On vérifie d'abord si le build existe ET appartient à l'utilisateur
    const build = await prisma.savedBuild.findFirst({
      where: {
        id: parseInt(id),
        userId: userId
      }
    });

    if (!build) {
      return res.status(404).json({ 
        message: "Build non trouvé ou vous n'avez pas l'autorisation de le supprimer." 
      });
    }

    // 2. Suppression du build
    // Note : Prisma gérera automatiquement la suppression des liaisons 
    // dans la table de jointure avec les composants.
    await prisma.savedBuild.delete({
      where: {
        id: parseInt(id)
      }
    });

    res.status(200).json({ message: "Le build a été supprimé avec succès." });

  } catch (error) {
    console.error("Erreur suppression:", error);
    res.status(500).json({ message: "Une erreur est survenue lors de la suppression." });
  }
};