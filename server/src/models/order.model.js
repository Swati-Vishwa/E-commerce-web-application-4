import mongoose, { Schema } from "mongoose";

export const ORDER_STATUSES = ["Pending", "Shipped", "Delivered"];
export const orderItemSchema = new Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  image: {
    type: String,
    default: ""
  },
}, { _id: false })

const orderSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  items: {
    type: [orderItemSchema],
    validate: [(v) => v.length > 0, "Order must have at least one item"]
  },
  total: {
    type: Number,
    required: true,
    min: 0
  },
  shippingAddress: {
    fullName: { type: String, required: [true, "Full name is required"]},
    phone: { type: String, required: [true, "Phone is required"], trim: true },
    address: { type: String, required: [true, "Address is required"], trim: true },
    city: { type: String, required: [true, "City is required"], trim: true },
    postalCode: { type: String, required: [true, "Postal code is required"], trim: true },
  },
  status: {
    type: String,
    enum: ORDER_STATUSES,
    default: "Pending"
  },
}, { timestamps: true });

orderSchema.index({ user: 1, createdAt: -1 });
export const Order = mongoose.model("Order", orderSchema)