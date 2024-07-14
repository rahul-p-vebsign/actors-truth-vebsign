/*
import { Request, Response, NextFunction, RequestHandler } from "express";
import { unless } from "express-unless";
import { CustomRequest } from "../interfaces/types";
import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";
import UserServices from "../services/user.service";
import { User } from "../entity/User";

const _usersService = new UserServices();
const verifyToken = async (
  request: CustomRequest,
  _response: Response,
  next: NextFunction
) => {
  if (!request.headers.authorization) {
    return next({ name: "UnauthorizedError", message: "Invalid token" });
  }
 
  const tokenBearer = request.headers.authorization.split(" ")[1];
  try {
    const token: DecodedIdToken = await verifier.verifyIdToken(tokenBearer);    
    const user = await _usersService.updateSertUser({userId:token.user_id,email:token.email} as User,"");    
    if(user?.organisation?.organisationId==null){   
      next({  message:"Please register your profile"});
    }else{
      request.user = {
        userId: token?.user_id as string,
        email: token?.email as string,
        emailVerified:token?.email_verified as boolean,
        role: user?.roles,
        auth_time:token?.auth_time,
        organizationId:user?.organisation?.organisationId
      };
    }    
     next();
  } catch(err) {
    console.log("FIREBASE ERR IS : ",err.message);
    next({ name: "UnauthorizedError", message: "Invalid token" });
  }
};
 
verifyToken.unless = unless;
  
export const authMiddleware = () => verifyToken;

*/