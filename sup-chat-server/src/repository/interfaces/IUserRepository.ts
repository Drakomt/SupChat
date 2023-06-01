import { IRepository } from "./IRepository.js";
import { IUser } from "../../schemas/user.js";
import { Schema } from "mongoose";
export interface IUserRepository extends IRepository<IUser> {
    findByEmail(email:string);
    findById(id: string);
}