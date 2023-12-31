
import express, { Request, Response } from "express"
import Product from "../model/Product.js";

const homeRouter = express.Router();


const createProduct = (req:Request,res:Response) =>{

    const product = new Product(req.body);
    product.save().then((doc)=>{
        res.status(201).json(doc)
    }).catch((error)=>{
        res.status(400).json(error);
    })
}

const deleteProduct = async (req:Request,res:Response) =>{
    try{
    const productId = req.params.id;
    const result = await Product.deleteOne({id:productId});
        if(result.deletedCount){
            res.status(200).json({message:"Deleted Successfully"});
        }
        else{
            res.status(400).json({message:"Not Found"});
        }
    }
    catch(error){
        res.status(501).json({message:"Server Error"})
    }
  
}

const fetchProducts = async (req:Request,res:Response) =>{
    const query = Product.find({});

    try {
        const docs = await query.exec();
        res.status(200).json({data:docs});
    } catch (error) {
        res.status(400).json(error);

    }
    
}


const getBusiness = (req:Request,res:Response) =>{

  //  const product = new Product(req.body);
    res.json({
        message:"Ha",
    })
}


homeRouter.route("/products").get(fetchProducts);
homeRouter.route("/create-product").post(createProduct);
homeRouter.route("/delete-product/:id").post(deleteProduct);



export default homeRouter;

