//import { User } from "../models/user.js";
import { User,IUser } from "../schemas/user.js";
import { Repository } from "./repository.js";
import mongoose,{ Model, Schema } from "mongoose";
import { IUserRepository } from './interfaces/IUserRepository.js'

export class UserRepository extends Repository<IUser> implements IUserRepository {
  constructor(model: Model<IUser>) {
    super(model);
  }

  async findByEmail(email: string){
    const user = await User.findOne({email})
    .populate('friends')
    .populate({
      path: 'chats',
      model:'Chat',
      populate:{
        path: 'messages',
        populate:{ path: 'user',select:'username email'},
        model:'Message'
        }});
    return user;
  }
  
  async findById(id: string){
    console.log("in findById id: ", id);
    const { ObjectId } = mongoose.Types;
    const user = await User.findOne({_id: new ObjectId(id)})
    .populate('friends')
    .populate({
      path: 'chats',
      model:'Chat',
      populate:{
        path: 'messages',
        populate:{ path: 'user',select:'username email'},
        model:'Message'
      }});
      console.log("in findById user: ", user);
    return user;
  }
  
}
