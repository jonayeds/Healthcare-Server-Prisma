import jwt, { SignOptions } from "jsonwebtoken";

const generateToken = (payload:any, secret:string, {expiresIn}:SignOptions)=>{
const token = jwt.sign(payload, secret, {
        expiresIn,
        algorithm:"HS256"
    } ) 
    return token;
}

export default generateToken;