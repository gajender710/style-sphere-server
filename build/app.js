'use strict';
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import homeRouter from "./routes/homeRoutes.js";
import { config } from "dotenv";
import Razorpay from "razorpay";
import checkoutRouter from "./routes/chekoutRoutes.js";
config();
const app = express();
const port = process.env.PORT;
app.use(express.json());
app.use(cors());
mongoose.set('strictQuery', true);
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('Mongo connection established'))
    .catch((error) => console.log('Connection error: ', error));
app.use(homeRouter);
app.use(checkoutRouter);
app.listen(port, () => {
    console.log("listening");
});
export const instance = new Razorpay({
    key_id: process.env.RAZOR_PAY_API_KEY ?? "",
    key_secret: process.env.RAZOR_PAY_API_SECRET_KEY,
});
//# sourceMappingURL=app.js.map