import prisma from "../../Config/prisma.js";

export const getProducts = async (req, res) => {
  try {
    const products = await prisma.component.findMany({
      where: { isActive: true }, 
      include: { category: true }
    });

    res.status(200).json(products);
  } catch (error) {
    console.error("PRISMA ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getProductById = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await prisma.component.findUnique({
      where: {
        id: id, // id est un UUID (String) dans ton schema
      },
      include: {
        category: true,
      },
    });

    // Produit introuvable ou désactivé
    if (!product || !product.isActive) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error("GET PRODUCT BY ID ERROR:", error);
    res.status(500).json({ message: "Failed to fetch product" });
  }
};
