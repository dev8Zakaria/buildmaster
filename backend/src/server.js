import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import auth from './Routes/admin/auth.js'
import category from './Routes/admin/category.js'
import component from './Routes/admin/component.js'

import ProductRoutes from "./Routes/client/products.js";
// import CartRoutes from "./Routes/client/cart.js";
// import OrderRoutes from "./Routes/client/orders.js";



dotenv.config();


const app = express();

 app.get("/", (req, res) => {
   res.send("API is running");
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:false}))




app.use('/api',auth);
app.use('/api/component',component);
app.use('/api/category',category);




app.use("/api/products", ProductRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
