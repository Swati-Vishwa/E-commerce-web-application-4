import mongoose from "mongoose";
import { Order, ORDER_STATUSES } from "../models/order.model.js";
import { Product } from "../models/product.model.js";
import APIerror from "../utils/API-Error.js";
import APIresponse from "../utils/API-Response.js";

const ADDRESS_FIELDS = ["fullName", "phone", "address", "city", "postalCode"];
const round2 = (n) => Math.round(n * 100) / 100;

//POST 
export const createOrder = async (req, res) => {
  console.log(req.body)
  const { items, shippingAddress } = req.body || {};
  if (!Array.isArray(items)) throw new APIerror(400, "Your cart is empty");

  const wanted = new Map();
  console.log(wanted, " :wanted")
  for (const item of items) {
    console.log(item)
    const qty = Number(item?.quantity)
    if (!mongoose.isValidObjectId(item?.product) || !Number.isInteger(qty) || qty < 1) {
      throw new APIerror(400, "Invalid cart item")
    }
    const id = String(item.product);
    wanted.set(id, (wanted.get(id) ?? 0) + qty);
  }
  const address = Object.fromEntries(ADDRESS_FIELDS.map((k) => [k, shippingAddress?.[k]]));

  const reserved = [];
  const orderItems = [];

  try {
    for (const [productId, qty] of wanted) {
      const product = await Product.findByIdAndUpdate(
        { _id: productId, stock: { $gte: qty } },
        { $inc: { stock: -qty } },
        { returnDocument: 'after' }
      );
      if (!product) {
        const existing = await Product.findById(productId);
        throw new APIerror(
          400,
          existing
            ? `Not enough stock for "${existing.name}"`
            : "A product in your cart no longer exists"
        );
      }

      reserved.push([productId, qty]);
      orderItems.push({
        product: product.id,
        name: product.name,
        price: product.price,
        quantity: qty,
        image: product.image
      });
    }

    const total = round2(orderItems.reduce((sum, i) => sum + i.price * i.quantity, 0));

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      total,
      shippingAddress: address
    });
    res.status(201).json(new APIresponse(200, order, "Order placed"));
  } catch (error) {
    await Promise.all(
      reserved.map(([id, qty]) => Product.updateOne({ _id: id }, { $inc: { stock: qty } }))
    )
    throw error;
  }
};

//GET orders
export const getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(new APIresponse(200, orders, "Orders fetched successfully"))
}

//GET orders (admin) 
export const getAllOrders = async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 }).populate("user", "name email")
  res.json(new APIresponse(200, orders, "(Admin) Orders fetched successfully"))
}

//PUT order status (admin)
export const updateOrderStatus = async (req, res) => {
  const { status } = req.body ?? {};
  if (!ORDER_STATUSES.includes(status)) {
    throw new APIerror(400, `Invalid order status ${ORDER_STATUSES.join(', ')}`);
  };

  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { status },
    { returnDocument: 'after' }
  ).populate('user', 'name email');

  if (!order) throw new APIerror(404, "Couldn't find order");
  res.json(200, order, "Order status updated successfully")
};