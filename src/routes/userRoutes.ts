
import express, { Request, Response } from "express"
import { User } from "../model/User.js";
import { generateJWT } from "../helpers/jwt.js";
import { validateCredential } from "../helpers/validators.js";

const userRouter = express.Router();

const signUp = async (req:Request,res:Response) =>{

    const validation = validateCredential(req.body.user_name,req.body.email,req.body.password);
   
    if(!validation.success){
        res.status(400).json(validation);
    }
    try {
        const duplicateUser = await User.findOne({email:req.body.email});
        if(duplicateUser){
            throw new Error("This email already exists")
        }

        const user = new User(req.body);
        await user.save();

        const token =  generateJWT(user); 
        res.status(200).json({
            success:true,
            message:"Sign up Success",
            token:token,
            data:user
        })

        
    } catch (error:any) { 
        res.status(400).json({
            success:false,
            message:error.message
        })
    }
}

const login = async (req:Request,res:Response) =>{
    const {email,password} = req.body

    try {
        const user  = await  User.findOne({email,password});
        if(!user){
            throw new Error("Invalid email or password");
        }

        const token =  generateJWT(user); 
        res.status(200).json({
            success:true,
            message:"Login Success",
            token:token,
            data:{user_name:user.user_name,email:user.email}
        })

    } catch (error) {
        res.status(400).json({
            status:false,
            message:"Invalid email or password"
        })
    }

}


userRouter.route("/sign-up").post(signUp);
userRouter.route("/login").post(login);

export default userRouter;