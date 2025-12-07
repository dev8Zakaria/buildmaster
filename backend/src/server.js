import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import {PrismaClient} from '@prisma/client'
import auth from './Routes/auth.js'

dotenv.config();


const app = express();

app.use(cors());
app.use(express.json());

const prismaClient =new PrismaClient({
  log:['query']
})


app.use('/api',auth);



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});


export default prismaClient;