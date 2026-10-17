import mongoose, { Schema } from "mongoose";

const productSchema = new Schema({
  name: {
    type: String,
    required: [true, "Product name is required"],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
    default: ""
  },
  price: {
    type: Number,
    required: [true, "Price is required"],
    min: [0, "Price cannot be less than zero"]
  },
  category: {
    type: String,
    required: [true, "Category is required"],
    trim: true
  },
  image: {
    type: String,
    trim: true, 
    default: ""
  },
  stock: {
    type: Number,
    required: [true, "Stock is required"],
    min: [0, "Stock cannot be less then zero"],
    validate: {
      validator: Number.isInteger,
      message: "Stock must be a whole number"
    },
  },
}, { timestamps: true });

export const Product = mongoose.model("Product", productSchema);