import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import { EntityManager, In } from "typeorm";
import { Role } from "../entity/Role";

class UserServices {
    async addUser(payload: User, transactionEntityManager: EntityManager) {
        try {
            const userRepo = transactionEntityManager.getRepository(User);
            const userInstance = await userRepo.findOne({
                where: { email: payload.email }
            });
    
            if (userInstance) {
                return new Error("User already exists.");
            }
    
            if (payload.roles && payload.roles.length > 0) {
                const roleRepo = transactionEntityManager.getRepository(Role);
                let roleData: Role[] = [];
                for (let i = 0; i < payload.roles.length; i++) {
                    const roleQueryBuilder = roleRepo.createQueryBuilder("role")
                        .select()
                        .where("role.roleId = :roleId", { roleId: payload.roles[i] });
                    
                    const roleInstance = await roleQueryBuilder.getOne();
                    if (roleInstance) {
                        roleData.push(roleInstance);
                    }
                }
                payload.roles = roleData;
            }
    
            const userData = await userRepo.save(payload);
            return userData;
        } catch (error) {
            console.log("Error is ", error);
            throw new Error("Failed to create user...");
        }
    }
    
    async getAllUsers() {
        try {
            let users = await AppDataSource.getRepository(User).find();
            return users;
        } catch (error) {
            console.log(error);
            throw new Error("Fail to get users");
        }
    }

    async getUserById(userId: string) {
        try {
            let user = await AppDataSource.getRepository(User).findOne({
                where: { userId }
            });
            return user;
        } catch (error) {
            console.log(error);
            throw new Error("Fail to get user");
        }
    }

    async updatePutUser(userId: string, userData: User, transactionEntityManager: EntityManager) {
        try {
            const userRepo = transactionEntityManager.getRepository(User);
            let user = await userRepo.findOne({ where: { userId } });

            if (!user) {
                throw new Error("User not found");
            }

            if (userData.email) {
                const emailExists = await userRepo.findOne({ where: { email: userData.email } });
                if (emailExists && emailExists.userId !== userId) {
                    throw new Error("Email already exists");
                }
            }

            if (userData.roles && userData.roles.length > 0) {
                const roleRepo = transactionEntityManager.getRepository(Role);
                let roleData: Role[] = [];
                for (let i = 0; i < userData.roles.length; i++) {
                    const roleQueryBuilder = roleRepo.createQueryBuilder("role")
                        .select()
                        .where("role.roleId = :roleId", { roleId: userData.roles[i] });
                    
                    const roleInstance = await roleQueryBuilder.getOne();
                    if (roleInstance) {
                        roleData.push(roleInstance);
                    }
                }
                userData.roles = roleData;
            }

            Object.assign(user, userData);
            const updatedUser = await userRepo.save(user);

            return updatedUser;
        } catch (error) {
            console.error("Error updating user:", error);
            throw new Error("Failed to update user");
        }
    }

    async updatePatchUser(userId: string, userData: Partial<User>, transactionEntityManager: EntityManager) {
        try {
            const userRepo = transactionEntityManager.getRepository(User);
            let user = await userRepo.findOne({ where: { userId } });

            if (!user) {
                throw new Error("User not found");
            }

            if (userData.email) {
                const emailExists = await userRepo.findOne({ where: { email: userData.email } });
                if (emailExists && emailExists.userId !== userId) {
                    throw new Error("Email already exists");
                }
            }

            if (userData.roles && userData.roles.length > 0) {
                const roleRepo = transactionEntityManager.getRepository(Role);
                let roleData: Role[] = [];
                for (let i = 0; i < userData.roles.length; i++) {
                    const roleQueryBuilder = roleRepo.createQueryBuilder("role")
                        .select()
                        .where("role.roleId = :roleId", { roleId: userData.roles[i] });
                    
                    const roleInstance = await roleQueryBuilder.getOne();
                    if (roleInstance) {
                        roleData.push(roleInstance);
                    }
                }
                userData.roles = roleData;
            }

            Object.assign(user, userData);
            const updatedUser = await userRepo.save(user);

            return updatedUser;
        } catch (error) {
            console.error("Error updating user:", error);
            throw new Error("Failed to update user");
        }
    }

    async softDeleteUser(userId: string, transactionEntityManager: EntityManager) {
        try {
            const userRepo = transactionEntityManager.getRepository(User);
            const user = await userRepo.findOne({ where: { userId } });

            if (!user) {
                return new Error("User not found");
            }

            user.deletedAt = new Date();
            const deletedUser = await userRepo.save(user);

            return deletedUser;
        } catch (error) {
            console.error("Error soft deleting user:", error);
            return new Error("Failed to soft delete user");
        }
    }
}

export default UserServices;
