import { User } from "../models/user.model.js";
import APIError from "../utils/API-Error.js";
import APIResponse from "../utils/API-Response.js";
import generateToken from "../utils/generateToken.js";

const toUser = (user) => ({ _id: user._id, name: user.name, email: user.email, role: user.role });
// POST /api/auth/register
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body ?? {};
  const user = await User.create({ name, email, password });
  res
    .status(200)
    .json(new APIResponse(200, { user: toUser(user), token: generateToken(user._id) }, "Account created"));
};

// POST /api/auth/login
export const loginUser = async (req, res) => {
  const { email, password } = req.body ?? {};
  if (typeof email !== "string" || typeof password !== "string" || !email || !password) {
    throw new APIError(400, "Email and password are required");
  }

  const user = await User.findOne({ email: email.toLowerCase().trim() }).select("+password");
  if (!user || !(await user.isPasswordCorrect(password))) {
    throw new APIError(401, "Invalid email or password");
  }

  res.json(new APIResponse(200, { user: toUser(user), token: generateToken(user._id) }, "Login successful"));
};

// GET /api/auth/me
export const getMe = async (req, res) => {
  res.json(new APIResponse(200, toUser(req.user), "User fetched"));
};