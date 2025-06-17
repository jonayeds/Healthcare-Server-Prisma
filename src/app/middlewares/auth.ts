import { NextFunction, Request, Response } from "express"
import config from "../../config"
import { jwtHelpers } from "../../helpers/jwtHelpers"

const auth = (...roles:string[])=>{
  return async(req:Request, res:Response, next:NextFunction)=>{
    try {
        const token = req.headers.authorization
        if(!token){
            throw new Error('You are not authorized!')          
        }
        const verifiedUser = jwtHelpers.verifyToken(token, config.jwt.jwt_secret as string)   
        if(!verifiedUser){
            throw new Error('You are not authorized!')          
        }           
        if(roles.length && !roles.includes(verifiedUser.role)){
            throw new Error('You are not authorized!')
        }
        next()
    } catch (error) {
        next(error)
    }
  }
}

export default auth;