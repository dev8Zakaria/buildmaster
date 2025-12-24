import prismaClient from '../../Config/prisma.js';


export const getProducts = async (req, res) => {
  try {
    const products = await prisma.component.findMany({
      where: { is_active: true },
      include: { category: true }
    });

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch products" });
  }
};

export const getProductById = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await prisma.component.findUnique({
      where: { id: Number(id) },
      include: { category: true }
    });

    if (!product || !product.is_active) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch product" });
  }
};