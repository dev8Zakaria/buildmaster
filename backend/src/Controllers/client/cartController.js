import prisma from "../../Config/prisma.js";
import { Prisma } from "@prisma/client";

// helper: recalcul total
async function recomputeOrderTotal(tx, orderId) {
  const items = await tx.orderItem.findMany({
    where: { orderId },
    select: { quantity: true, unitPrice: true },
  });

  let total = new Prisma.Decimal(0);
  for (const it of items) {
    total = total.add(it.unitPrice.mul(it.quantity));
  }

  return tx.order.update({
    where: { id: orderId },
    data: { totalAmount: total },
  });
}

// GET /api/cart
export const getCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const cart = await prisma.order.findFirst({
      where: { userId, status: "PENDING" },
      include: { items: { include: { component: true } } },
    });

    return res.status(200).json(cart ?? { items: [], totalAmount: 0 });
  } catch (e) {
    console.error("GET CART ERROR:", e);
    return res.status(500).json({ msg: "Failed to get cart" });
  }
};

// POST /api/cart/add
// body: { componentId, quantity? }
export const addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { componentId, quantity } = req.body;
    const qty = quantity ? Number(quantity) : 1;

    if (!componentId || typeof componentId !== "string") {
      return res.status(400).json({ msg: "componentId is required" });
    }
    if (!Number.isInteger(qty) || qty <= 0) {
      return res.status(400).json({ msg: "quantity must be a positive integer" });
    }

    const result = await prisma.$transaction(async (tx) => {
      // 1) trouver ou créer Order PENDING
      let cart = await tx.order.findFirst({
        where: { userId, status: "PENDING" },
      });

      if (!cart) {
        cart = await tx.order.create({
          data: { userId, status: "PENDING", totalAmount: new Prisma.Decimal(0) },
        });
      }

      // 2) vérifier le composant
      const comp = await tx.component.findFirst({
        where: { id: componentId, isActive: true },
        select: { id: true, price: true, stock: true },
      });

      if (!comp) {
        return { error: "Component not found or inactive" };
      }

      // stock check (optionnel ici, obligatoire au checkout)
      if (comp.stock < qty) {
        return { error: "Insufficient stock" };
      }

      // 3) créer OU incrementer OrderItem (grâce à @@unique([orderId, componentId]))
      await tx.orderItem.upsert({
        where: { orderId_componentId: { orderId: cart.id, componentId: comp.id } },
        create: {
          orderId: cart.id,
          componentId: comp.id,
          quantity: qty,
          unitPrice: comp.price, // prix figé à l’ajout
        },
        update: {
          quantity: { increment: qty },
          // on ne change pas unitPrice (figé)
        },
      });

      // 4) recalcul total
      await recomputeOrderTotal(tx, cart.id);

      // 5) retourner panier
      const fullCart = await tx.order.findUnique({
        where: { id: cart.id },
        include: { items: { include: { component: true } } },
      });

      return { cart: fullCart };
    });

    if (result.error) return res.status(400).json({ msg: result.error });
    return res.status(200).json(result.cart);
  } catch (e) {
    console.error("ADD TO CART ERROR:", e);
    return res.status(500).json({ msg: "Failed to add to cart" });
  }
};

// POST /api/cart/buy-now
// même logique que addToCart, mais le frontend redirige checkout
export const buyNow = async (req, res) => {
  // on réutilise addToCart puis on renvoie un flag
  // (backend ne “redirige” pas, c’est le frontend qui redirige)
  req.body.quantity = req.body.quantity ?? 1;

  // on appelle addToCart “manuellement”
  // plus simple: dupliquer logique? non. Ici on fait simple:
  // => appelle addToCart, puis renvoie { cartId, goCheckout: true }
  try {
    // on fait la même transaction que addToCart en appelant directement la fonction :
    // (pour rester clair, on recopie une mini version)
    const userId = req.user.id;
    const { componentId } = req.body;

    const cart = await prisma.order.findFirst({
      where: { userId, status: "PENDING" },
    });

    // si pas de cart, addToCart la créera
    // donc on appelle addToCart via un “fake res” serait moche
    // => solution clean: le frontend appelle /cart/add puis redirige
    return res.status(400).json({
      msg: "Use /api/cart/add then redirect to checkout (frontend).",
    });
  } catch (e) {
    console.error("BUY NOW ERROR:", e);
    return res.status(500).json({ msg: "Failed buy now" });
  }
};

// POST /api/cart/checkout
export const checkout = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await prisma.$transaction(async (tx) => {
      const cart = await tx.order.findFirst({
        where: { userId, status: "PENDING" },
        include: { items: true },
      });

      if (!cart) return { error: "No active cart" };
      if (cart.items.length === 0) return { error: "Cart is empty" };

      // 1) vérifier stock pour chaque item
      for (const it of cart.items) {
        const comp = await tx.component.findUnique({
          where: { id: it.componentId },
          select: { stock: true, isActive: true },
        });

        if (!comp || !comp.isActive) return { error: "Component inactive/not found" };
        if (comp.stock < it.quantity) return { error: "Insufficient stock" };
      }

      // 2) décrémenter stock
      for (const it of cart.items) {
        await tx.component.update({
          where: { id: it.componentId },
          data: { stock: { decrement: it.quantity } },
        });
      }

      // 3) recalcul total (sécurité)
      await recomputeOrderTotal(tx, cart.id);

      // 4) passer à PAID
      const paidOrder = await tx.order.update({
        where: { id: cart.id },
        data: { status: "PAID" },
        include: { items: { include: { component: true } } },
      });

      return { order: paidOrder };
    });

    if (result.error) return res.status(400).json({ msg: result.error });
    return res.status(200).json(result.order);
  } catch (e) {
    console.error("CHECKOUT ERROR:", e);
    return res.status(500).json({ msg: "Failed to checkout" });
  }
};

// PATCH /api/cart/item/:itemId
// body: { quantity }
export const updateCartItemQty = async (req, res) => {
  try {
    const userId = req.user.id;
    const itemId = Number(req.params.itemId);
    const { quantity } = req.body;
    const qty = Number(quantity);

    if (!Number.isInteger(itemId)) return res.status(400).json({ msg: "Invalid itemId" });
    if (!Number.isInteger(qty) || qty <= 0) return res.status(400).json({ msg: "quantity must be > 0" });

    const cart = await prisma.$transaction(async (tx) => {
      const order = await tx.order.findFirst({
        where: { userId, status: "PENDING" },
      });
      if (!order) return { error: "No active cart" };

      // ensure item belongs to this user's pending order
      const item = await tx.orderItem.findFirst({
        where: { id: itemId, orderId: order.id },
        include: { component: true },
      });
      if (!item) return { error: "Item not found in your cart" };

      // stock check (optional, but good)
      if (item.component.stock < qty) return { error: "Insufficient stock" };

      await tx.orderItem.update({
        where: { id: itemId },
        data: { quantity: qty },
      });

      await recomputeOrderTotal(tx, order.id);

      return tx.order.findUnique({
        where: { id: order.id },
        include: { items: { include: { component: true } } },
      });
    });

    if (cart?.error) return res.status(400).json({ msg: cart.error });
    return res.status(200).json(cart);
  } catch (e) {
    console.error("UPDATE CART ITEM ERROR:", e);
    return res.status(500).json({ msg: "Failed to update item" });
  }
};

// DELETE /api/cart/item/:itemId
export const removeCartItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const itemId = Number(req.params.itemId);

    if (!Number.isInteger(itemId)) return res.status(400).json({ msg: "Invalid itemId" });

    const cart = await prisma.$transaction(async (tx) => {
      const order = await tx.order.findFirst({
        where: { userId, status: "PENDING" },
      });
      if (!order) return { error: "No active cart" };

      const item = await tx.orderItem.findFirst({
        where: { id: itemId, orderId: order.id },
      });
      if (!item) return { error: "Item not found in your cart" };

      await tx.orderItem.delete({ where: { id: itemId } });

      await recomputeOrderTotal(tx, order.id);

      return tx.order.findUnique({
        where: { id: order.id },
        include: { items: { include: { component: true } } },
      });
    });

    if (cart?.error) return res.status(400).json({ msg: cart.error });
    return res.status(200).json(cart);
  } catch (e) {
    console.error("REMOVE ITEM ERROR:", e);
    return res.status(500).json({ msg: "Failed to remove item" });
  }
};