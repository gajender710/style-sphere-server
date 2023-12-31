import express, { Request, Response } from "express"
import { instance } from "../app.js";
import { User } from "../model/User.js";
import { Order, OrderItem, ShippingDetails } from "../model/Order.js";
import { format } from "date-fns";
import crypto from "crypto"
import Product from "../model/Product.js";

const checkoutRouter = express.Router();

const checkout = async (req:Request,res:Response) =>{

  const userForm = req.body.user_form;

  let user = await User.findOne({email:userForm.email});
  
  if(!user){
    user = new User({
        username:userForm.name,
        email:userForm.email,
        mobile_number:userForm.mobile_number,
      })
      await user.save();
  }
  console.log(user,"user");
  
 
  const shippingDetail = new ShippingDetails({
    user:user._id,
    name:userForm.name,
    address:userForm.shipping_information.address,
    city:userForm.shipping_information.city,
    state:userForm.shipping_information.state,
    landmark:userForm.shipping_information.landmark,
    pinCode:userForm.shipping_information.pincode,
  })
  await shippingDetail.save()

  const subtotal = req.body.cart_items.reduce((acc:number, it:any) => {
    return acc + (it.quantity ?? 1) * it.price;
  }, 0);
  const gst = Number(((subtotal * 18) / 100).toFixed(2));
  const totalAmount = (subtotal + gst).toFixed(2);

  const order = new Order({
    user:user._id,
    totalAmount:totalAmount,
    orderDate:Date.now()
  })

  await order.save();

  for (const item of req.body.cart_items) {
    const orderItem = new OrderItem({
      order: order._id,
      productId:item.id,
      category:item.category,
      title: item.title,
      quantity: item.quantity,
      price: item.price,
    });

    await orderItem.save();
  }

    //multiplied with 100 for unit value of currency, eg: 1 rupee == 100 paisa
    var options = {
        amount: totalAmount*100,
        currency: "INR",
      };
      const response = await instance.orders.create(options);
      console.log(response,"response on order")
      res.status(200).json({
        data:response,
        order_id:order._id,
        success:true
      })
}
const getRazorpayKey = async (req:Request,res:Response) =>{
    res.status(200).json({
      key:process.env.RAZOR_PAY_API_KEY,
      success:true
    })
}

const paymentVerification = async (req:Request,res:Response) =>{
  const {razorpay_signature,razorpay_order_id,razorpay_payment_id} = req.body;
  const body = razorpay_order_id + "|" + razorpay_payment_id;
  console.log(body,"orderid and paymentid")

  const generatedSignature = crypto.createHmac('sha256', process.env.RAZOR_PAY_API_SECRET_KEY as string)
  .update(body)
  .digest('hex');
  const verificationSuccess = generatedSignature === razorpay_signature;
  console.log("secret key",process.env.RAZOR_PAY_API_SECRET_KEY)
  console.log(generatedSignature,"--",razorpay_signature)
  Order.findOneAndUpdate({_id:razorpay_order_id,},{$set:{status:verificationSuccess ? "Success" : "Fail"}});
 if(verificationSuccess){
  res.status(200).json({
    status:true,
    message:"Payment Successful"
  })
 }
 else{
  res.status(400).json({
    status:false,
    message:"Invalid Payment"
  })
 }
}


checkoutRouter.route("/checkout").post(checkout);
checkoutRouter.route("/get-payment-key").get(getRazorpayKey)
checkoutRouter.route("/payment-verification").post(paymentVerification)



export default checkoutRouter;
