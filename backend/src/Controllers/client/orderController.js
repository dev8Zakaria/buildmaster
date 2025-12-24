import prisma from "../../Config/prisma.js";

// GET /api/orders/me (PAID only)
export const getMyPaidOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    const orders = await prisma.order.findMany({
      where: { userId, status: "PAID" },
      orderBy: { createdAt: "desc" },
      include: { items: { include: { component: true } } },
    });

    return res.status(200).json(orders);
  } catch (e) {
    console.error("GET PAID ORDERS ERROR:", e);
    return res.status(500).json({ msg: "Failed to fetch orders" });
  }
};

// GET /api/orders/:id (PAID + belongs to me)
export const getMyPaidOrderById = async (req, res) => {
  try {
    const userId = req.user.id;
    const orderId = Number(req.params.id);

    if (!Number.isInteger(orderId)) {
      return res.status(400).json({ msg: "Invalid order id" });
    }

    const order = await prisma.order.findFirst({
      where: { id: orderId, userId, status: "PAID" },
      include: { items: { include: { component: true } } },
    });

    if (!order) return res.status(404).json({ msg: "Order not found" });
    return res.status(200).json(order);
  } catch (e) {
    console.error("GET PAID ORDER ERROR:", e);
    return res.status(500).json({ msg: "Failed to fetch order" });
  }
};
