import { Router } from "express";
import { bodySchemaValidator } from "../middlewares/schema.validator";
import {profileSchema} from "../schemas/user.schemas"
import UserController from "../controllers/user.controller";

const userRouter=Router();
const userController=new UserController();

userRouter.post(
    "/",
    bodySchemaValidator(profileSchema),
    userController.addUser
)

userRouter.get(
    "/",
    userController.getAllUsers
)

userRouter.get(
    "/:userId",
    userController.getUserById
)

userRouter.put(
    "/:userId",    
    userController.updatePutUser
)

userRouter.patch(
    "/:userId",
    userController.updatePatchUser
)

userRouter.delete(
    "/:userId",
    userController.deleteUser
)

export default userRouter;