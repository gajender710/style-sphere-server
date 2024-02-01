'use strict'
import express from "express";
import mongoose, { ConnectOptions } from "mongoose";
import cors from "cors"
import homeRouter from "./routes/homeRoutes.js";
import {config} from "dotenv"
import Razorpay from "razorpay";
import checkoutRouter from "./routes/chekoutRoutes.js";
import userRouter from "./routes/userRoutes.js";
import cookieParser from "cookie-parser"

config();

const app = express();
const port = process.env.PORT;
app.use(express.json());

app.use(cors({credentials: true, origin: true,}))
app.use(cookieParser());


mongoose.set('strictQuery', true);

mongoose.connect(process.env.MONGO_URL as string, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	} as ConnectOptions).then(() => console.log('Mongo connection established'))
.catch((error) => console.log('Connection error: ', error));


app.use(homeRouter);
app.use("/user",checkoutRouter);
app.use(userRouter);

app.listen(port,()=>{
    console.log("listening")
})


export const instance = new Razorpay({
	key_id: process.env.RAZOR_PAY_API_KEY ?? "",
	key_secret: process.env.RAZOR_PAY_API_SECRET_KEY,
  });
