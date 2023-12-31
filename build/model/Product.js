import mongoose, { Schema } from "mongoose";
const productSchema = new Schema({
    title: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    price: { type: Number, min: [0, 'wrong min price'], max: [10000, 'wrong max price'] },
    discount_percentage: { type: Number, min: [0, 'wrong min discount'], max: [1000, 'wrong max discount'] },
    stock: { type: Number, min: [0, 'wrong min stock'] },
    category: { type: String, required: true },
    images: { type: [String], required: true },
});
const virtual = productSchema.virtual('id');
virtual.get(function () {
    return this._id;
});
productSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) { delete ret._id; }
});
const Product = mongoose.model("Product", productSchema);
export default Product;
//# sourceMappingURL=Product.js.map