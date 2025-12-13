import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import auth from './Routes/auth.js'
import product from './Routes/product.js'

dotenv.config();


const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:false}))




app.use('/api',auth);
app.use('/api/product',product)



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
