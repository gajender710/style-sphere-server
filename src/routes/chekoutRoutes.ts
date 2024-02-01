import express, { Request, Response } from "express"
import { instance } from "../app.js";
import { User } from "../model/User.js";
import { Order, OrderItem, ShippingDetails } from "../model/Order.js";
import { format } from "date-fns";
import crypto from "crypto"
import Product from "../model/Product.js";
import { authenticateUser } from "../middlewares/auth.js";


const checkoutRouter = express.Router();

const checkout = async (req:Request,res:Response) =>{

  const userForm = req.body.user_form;
  
  let user = await User.findOne({email:(req as any).user.email});
  
  if(!user){
   return res.status(403).json({
    message:"Unauthorized"
   })
  }
 
  const shippingDetail = new ShippingDetails({
    user:user.id,
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

  //multiplied with 100 for unit value of currency, eg: 1 rupee == 100 paisa    
  const options = {
    amount: totalAmount*100,
    currency: "INR",
  };
  const response = await instance.orders.create(options);


  const order = new Order({
    orderId:response.id,
    user:user.id,
    totalAmount:totalAmount,
    orderDate:Date.now(),
  })


  const orderItems =  req.body.cart_items.map((item:any)=>{
    const orderItem =  new OrderItem({
      order: order._id,
      productId:item.id,
      description:item.description,
      images:item.images,
      discount_percentage:item.discount_percentage,
      category:item.category,
      title: item.title,
      quantity: item.quantity,
      stock:item.stock,
      price: item.price,
    });
    orderItem.save();
    return orderItem;
  })

  order.orderItems = orderItems;
  await order.save();

  res.status(200).json({
    data:response,
    order_id:response.id,
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

  const generatedSignature = crypto.createHmac('sha256', process.env.RAZOR_PAY_API_SECRET_KEY as string)
  .update(body)
  .digest('hex');
  const verificationSuccess = generatedSignature === razorpay_signature;
  await Order.findOneAndUpdate({orderId:razorpay_order_id,},{$set:{status:verificationSuccess ? "Success" : "Fail"},},{ new: true });
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


const getOrders = async (req:Request,res:Response) =>{

  try {
      const query = Order.find({user:(req as any).user.id}).populate("orderItems");
      const docs = await query.exec();
      res.status(200).json({data:docs,message:"Success"});
  } catch (error) {
      res.status(400).json(error);
  }
  
}



checkoutRouter.route("/checkout").post(authenticateUser,checkout);
checkoutRouter.route("/get-payment-key").get(authenticateUser,getRazorpayKey)
checkoutRouter.route("/payment-verification").post(authenticateUser,paymentVerification)
checkoutRouter.route("/orders").get(authenticateUser,getOrders);




export default checkoutRouter;
