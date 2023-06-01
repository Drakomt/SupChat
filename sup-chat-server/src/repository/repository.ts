import mongoose, { Model, Document, Schema, } from "mongoose";
import { IRepository } from "./interfaces/IRepository.js";

export class Repository<T> implements IRepository<T> {
  private model: Model<T>;
  constructor(model: Model<T>) {
    this.model = model;
  }
  async getManyById(List: String[]): Promise<T[]> {
    const items = await this.model.find({ _id: { $in: List } })
    return items;
  }

  async add(obj: T): Promise<void> {
    await this.model.create(obj);
    await new this.model(obj).save();
  }

//  async add(obj: T): Promise<T> {
//   const createdObject = await this.model.create(obj);
//   await new this.model(obj).save();
//   return createdObject;
// }


  async getAll(): Promise<T[]> {
    const items = await this.model.find().exec();
    return items;
  }

  async getById(id: Schema.Types.ObjectId): Promise<T> {
    const item = await this.model.findById(id);
    return item;
  }

  async update(id: Schema.Types.ObjectId, obj: T): Promise<void> {
    await this.model.findByIdAndUpdate(id, obj);
    await new this.model(obj).save();
  }

  async delete(id: String): Promise<void> {
    await this.model.findByIdAndDelete(id);
  }
}


