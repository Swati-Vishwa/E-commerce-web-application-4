import express from 'express';
import cors from 'cors';
import { notFound, errorHandler } from "./middleware/errorHandler.middleware.js";

const app = express();
app.use(cors());
app.use(express.json());

//importing routes
import authRoute from "./routes/auth.route.js";
import productRoute from "./routes/product.route.js";
import orderRoute from "./routes/order.route.js";

app.get('/', (req, res) => res.json({message: "API running"}));
app.use('/api/auth', authRoute);
app.use('/api/products', productRoute);
app.use('/api/orders', orderRoute);

app.use(notFound)
app.use(errorHandler)

export default app;