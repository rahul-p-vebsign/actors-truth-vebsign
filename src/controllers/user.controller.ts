import { Request, Response } from "express";
import UserServices from "../services/user.service";
import { CustomRequest } from "../interfaces/types";
import { errorHandler } from "../common/errors";
import { makeResponse } from "../common/utils";
import { User } from "../entity/User";
import { AppDataSource } from "../data-source";

const userservices = new UserServices();

class UserController {
    async addUser(request: CustomRequest, response: Response) {
        try {
            const userData: User = request.body;
            if (!userData) {
                return makeResponse(response, 404, false, "Please provide user information", null);
            }

            const user = await AppDataSource.transaction(async (transactionEntityManager) => {
                const user = await userservices.addUser(userData, transactionEntityManager);
                return user;
            });

            if (user instanceof Error) {
                return makeResponse(response, 400, false, user.message, null);
            }

            if (!user) {
                return makeResponse(response, 404, false, "Failed to create user", null);
            }

            return makeResponse(response, 200, true, "User created successfully", user);
        } catch (error) {
            return errorHandler(response, error.message);
        }
    }

    async getAllUsers(_request: Request, response: Response) {
        try {
            const users = await userservices.getAllUsers();
            if (users?.length == 0 || users == undefined) {
                return makeResponse(response, 200, true, "Users not found", null);
            }
            return makeResponse(response, 200, true, "Users fetched successfully", users);
        } catch (error) {
            return errorHandler(response, error.message);
        }
    }

    async getUserById(request: CustomRequest, response: Response) {
        try {
            const userId: string = request.params.userId;
            if (!userId) {
                return makeResponse(response, 404, false, "Please provide user id", null);
            }
            const user = await userservices.getUserById(userId);
            if (!user) {
                return makeResponse(response, 200, false, "User not found", null);
            }
            return makeResponse(response, 200, true, "User fetched successfully", user);
        } catch (error) {
            return errorHandler(response, error.message);
        }
    }

    async updatePutUser(request: Request, response: Response) {
        try {
            const userId = request.params.userId;
            const userData = request.body;

            if (!userId) {
                return makeResponse(response, 400, false, "Please provide user ID", null);
            }

            if (!userData || Object.keys(userData).length === 0) {
                return makeResponse(response, 400, false, "Please provide complete user data to update", null);
            }

            const user = await AppDataSource.transaction(async (transactionEntityManager) => {
                const user = await userservices.updatePutUser(userId, userData, transactionEntityManager);
                return user;
            });

            if (user instanceof Error) {
                return makeResponse(response, 400, false, user.message, null);
            }

            return makeResponse(response, 200, true, "User updated successfully", user);
        } catch (error) {
            return errorHandler(response, error.message);
        }
    }

    async updatePatchUser(request: Request, response: Response) {
        try {
            const userId = request.params.userId;
            const userData = request.body;

            if (!userId) {
                return makeResponse(response, 400, false, "Please provide user ID", null);
            }

            if (!userData || Object.keys(userData).length === 0) {
                return makeResponse(response, 400, false, "Please provide partial user data to update", null);
            }

            const user = await AppDataSource.transaction(async (transactionEntityManager) => {
                return await userservices.updatePatchUser(userId, userData, transactionEntityManager);
            });

            if (user instanceof Error) {
                return makeResponse(response, 400, false, user.message, null);
            }

            return makeResponse(response, 200, true, "User updated successfully", user);
        } catch (error) {
            return errorHandler(response, error.message);
        }
    }

    async deleteUser(request: Request, response: Response) {
        try {
            const userId = request.params.userId;

            if (!userId) {
                return makeResponse(response, 400, false, "Please provide user ID", null);
            }

            const user = await AppDataSource.transaction(async (transactionEntityManager) => {
                return await userservices.softDeleteUser(userId, transactionEntityManager);
            });

            if (user instanceof Error) {
                return makeResponse(response, 400, false, user.message, null);
            }

            return makeResponse(response, 200, true, "User soft deleted successfully", user);
        } catch (error) {
            return errorHandler(response, error.message);
        }
    }
}

export default UserController;
