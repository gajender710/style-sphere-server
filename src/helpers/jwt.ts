import jwt from "jsonwebtoken"
import { Schema } from "mongoose";

export const generateJWT = (user:any) => {
	try {
		let payload = {
			id: user.id,
			email:user.email,
		};

		let token = jwt.sign(payload, process.env.JWT_SECRET_KEY!);

		return token;

	} catch (error) {
		return null;
	}
};

export const  verifyJWT = (token:string) => {
	try {
		let payload = jwt.verify(token, process.env.JWT_SECRET_KEY!);
		return payload;
		
	} catch (error) {
		return null;
	}
};

