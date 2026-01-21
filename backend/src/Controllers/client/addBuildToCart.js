import prisma from "../../Config/prisma.js";
import { Prisma } from "@prisma/client";

export const transferBuildToOrder = async (req, res) => {
  try {
    const { buildId } = req.params;
    const userId = req.user.id;

    // 1. Récupérer le build avec tous ses composants
    const build = await prisma.savedBuild.findFirst({
      where: {
        id: parseInt(buildId),
        userId: userId
      },
      include: {
        components: true
      }
    });

    if (!build) {
      return res.status(404).json({ message: "Build non trouvé." });
    }

    // 2. Créer une nouvelle commande (Order) avec le statut PENDING (Panier)
    // On utilise une transaction pour s'assurer que tout est créé correctement
    const newOrder = await prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          userId: userId,
          status: 'PENDING',
          totalAmount: build.total_price,
          // 3. Créer les OrderItems à partir des composants du build
          items: {
            create: build.components.map((comp) => ({
              quantity: 1,
              unitPrice: comp.price,
              componentId: comp.id
            }))
          }
        },
        include: {
          items: true
        }
      });
      return order;
    });

    res.status(201).json({ 
      message: "Composants transférés au panier avec succès", 
      orderId: newOrder.id 
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors du transfert vers le panier." });
  }
};