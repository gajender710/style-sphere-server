import { NextFunction ,Request,Response} from "express";
import { verifyJWT } from "../helpers/jwt.js";
import jwt from "jsonwebtoken"

interface AuthenticatedRequest extends Request {
  user?: { id: string };
}


 export const authenticateUser = (req:AuthenticatedRequest, res:Response, next:NextFunction) => {
    const token = req.headers['authorization'];
    const user : any = !!token  ? verifyJWT(token.split("Bearer")[1].toString().trim()) : null;

    if(!user){
      console.log(user,"user",token?.split("Bearer")[1].toString().trim())
      return res.status(403).json({message:"Unauthorized"});
    }
    req.user = user;
    return next();
  };

