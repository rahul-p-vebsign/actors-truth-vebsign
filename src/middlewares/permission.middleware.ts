import { NextFunction, Response,Request } from "express";
import { CustomRequest } from "../interfaces/types";
import { ForbiddenError } from "../common/errors";
import { User } from "../entity/User";
import { AppDataSource } from "../data-source";
import { roleNames } from "../common/utils";


function hasPermission(requiredPermission: string[]) {
  return async (request: CustomRequest, _res: Response, next: NextFunction) => {
    const roles = request.user.roles;
    if (roles.length>0) {
      for(let role of roles){
        if(requiredPermission.includes(role.roleName)){
          return next();
        }
      }
      return next(
          new ForbiddenError(
            `User does not have permission ${requiredPermission}`
          )
        );
      
      }
    }
  }


export default hasPermission;
