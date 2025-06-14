import { NextFunction, Request, Response } from "express";
import { AnyZodObject } from "zod";

const validateRequest = (schema:AnyZodObject)=>{
    return async(req:Request, res:Response,next:NextFunction)=>{
        try {
            const parsed = await schema.parseAsync({body:req.body})
            req.body = parsed.body;
            return next();  
        } catch (error) {
            next(error)
        }
}
}

export default validateRequest;         