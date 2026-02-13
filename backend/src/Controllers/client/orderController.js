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
// GET /api/orders/admin/all (ADMIN ONLY)
export const getAllOrdersAdmin = async (req, res) => {
  try {
    // Note: Assure-toi que ton middleware isAdmin protège cette route

    const orders = await prisma.order.findMany({
      where: {
        status: "PAID" // On ne veut que les commandes validées
      },
      orderBy: {
        createdAt: "desc" // Les plus récentes en premier
      },
      include: {
        user: { // On inclut les infos du client pour savoir qui a commandé
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        items: {
          include: {
            component: { // On inclut les détails des produits
              select: {
                name: true,
                brand: true,
                price: true,
                ImageUrl: true
              }
            }
          }
        }
      }
    });

    return res.status(200).json(orders);
  } catch (e) {
    console.error("GET ADMIN ORDERS ERROR:", e);
    return res.status(500).json({ msg: "Failed to fetch all orders" });
  }
};

// GET /api/orders/admin/stats (ADMIN ONLY)
export const getAdminStats = async (req, res) => {
  try {
    // 1) Total revenue from paid orders
    const revenueResult = await prisma.order.aggregate({
      where: { status: "PAID" },
      _sum: { totalAmount: true },
      _count: true,
    });

    // 2) Total customers
    const customerCount = await prisma.user.count({
      where: { role: "Customer" },
    });

    // 3) Total products
    const productCount = await prisma.component.count();

    // 4) Low stock products (stock <= 5)
    const lowStockCount = await prisma.component.count({
      where: { stock: { lte: 5 } },
    });

    // 5) Top-selling products (by quantity sold)
    const topProducts = await prisma.orderItem.groupBy({
      by: ['componentId'],
      where: { order: { status: "PAID" } },
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: 5,
    });

    // Enrich top products with component details
    const topProductsDetails = await Promise.all(
      topProducts.map(async (tp) => {
        const comp = await prisma.component.findUnique({
          where: { id: tp.componentId },
          select: { name: true, brand: true, price: true, ImageUrl: true },
        });
        return {
          ...comp,
          totalSold: tp._sum.quantity,
        };
      })
    );

    // 6) Revenue by category
    const allPaidItems = await prisma.orderItem.findMany({
      where: { order: { status: "PAID" } },
      include: {
        component: {
          select: { category: { select: { name: true } } },
        },
      },
    });

    const revenueByCategory = {};
    for (const item of allPaidItems) {
      const catName = item.component?.category?.name || "Unknown";
      const itemTotal = Number(item.unitPrice) * item.quantity;
      revenueByCategory[catName] = (revenueByCategory[catName] || 0) + itemTotal;
    }

    // 7) Orders over time (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentOrders = await prisma.order.findMany({
      where: { status: "PAID", createdAt: { gte: thirtyDaysAgo } },
      orderBy: { createdAt: "asc" },
      select: { createdAt: true, totalAmount: true },
    });

    return res.status(200).json({
      totalRevenue: Number(revenueResult._sum.totalAmount || 0),
      totalOrders: revenueResult._count,
      totalCustomers: customerCount,
      totalProducts: productCount,
      lowStockCount,
      topProducts: topProductsDetails,
      revenueByCategory: Object.entries(revenueByCategory).map(([name, revenue]) => ({ name, revenue: Number(revenue.toFixed(2)) })),
      recentOrders: recentOrders.map(o => ({
        date: o.createdAt.toISOString().split('T')[0],
        amount: Number(o.totalAmount),
      })),
    });
  } catch (e) {
    console.error("GET ADMIN STATS ERROR:", e);
    return res.status(500).json({ msg: "Failed to fetch stats" });
  }
};
