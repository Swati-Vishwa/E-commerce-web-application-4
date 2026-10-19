import { Product } from "../models/product.model.js";
import APIerror from "../utils/API-Error.js";
import APIresponse from "../utils/API-Response.js";

const FIELDS = ["name", "description", "price", "category", "image", "stock"];

const pick = (obj, keys) =>
  Object.fromEntries(keys.filter((k) => obj?.[k] !== undefined).map((k) => [k, obj[k]]));

//replace regax
const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

//GET
export const getProducts = async (req, res) => {
  const { search, category } = req.query;
  const filter = {};

  if (typeof search === 'string' && search.trim()) {
    filter.name = { $regex: escapeRegex(search.trim()), $options: "i" }
  }
  if (category && typeof category === 'string') {
    filter.category = category;
  }

  const products = await Product.find(filter).sort({ createdAt: -1 });
  res.json(new APIresponse(200, products, "Product fetched successfully"))
};

//GET categories
export const getCategories = async (req, res) => {
  const categories = await Product.distinct('category')
  res.json(new APIresponse(200, categories.sort(), "Categories fetched successfully"))
}

//GET product by id
export const getProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw new APIerror(404, "Couldn't find the product");
  res.json(new APIresponse(200, product, "Product fetched successfully"))
}

//POST products (admin)
export const createProduct = async (req, res) => {
  const product = await Product.create(pick(req.body, FIELDS))
  res.status(200).json(new APIresponse(200, product, "Product added successfully"))
}

//PUT product (admin)
export const updateProduct = async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, pick(req.body, FIELDS), {
    returnDocument: 'after',
    runValidators: true
  });
  if (!product) throw new APIerror(404, "Product not found");
  res.json(new APIresponse(200, product, "Product updated successfully"))
}

//DELETE product (admin)
export const deleteProduct = async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id)
  if (!product) throw new APIerror(404, "Product not found");
  res.json(new APIresponse(200, null, "Product deleted successfully"))
}