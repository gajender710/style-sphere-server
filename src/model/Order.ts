import mongoose from "mongoose";

const shippingDetailsSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    landmark :{type:String,required:true},
    pinCode: { type: Number, required: true },
  });


const orderSchema = new mongoose.Schema({
    orderId:{type:String,required: true},
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    orderDate: { type: Date, default: Date.now },
    totalAmount: { type: Number, required: true },
    status: { type: String, default: 'Pending' },
    orderItems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'OrderItem' }],
  });

  const orderItemSchema = new mongoose.Schema({
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    productId:{type:String,required: true },
    title: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    description:{type:String,required:true},
    discount_percentage: { type: Number, required: true },
    stock:{type:Number, required: true },
    quantity: { type: Number, required: true },
    images:{type:[String],required:true},
  });

export const ShippingDetails = mongoose.model('ShippingDetails', shippingDetailsSchema);
export  const Order = mongoose.model('Order', orderSchema);
export const OrderItem = mongoose.model('OrderItem', orderItemSchema);

  