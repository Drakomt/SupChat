export class Repository {
    model;
    constructor(model) {
        this.model = model;
    }
    async getManyById(List) {
        const items = await this.model.find({ _id: { $in: List } });
        return items;
    }
    async add(obj) {
        await this.model.create(obj);
        await new this.model(obj).save();
    }
    //  async add(obj: T): Promise<T> {
    //   const createdObject = await this.model.create(obj);
    //   await new this.model(obj).save();
    //   return createdObject;
    // }
    async getAll() {
        const items = await this.model.find().exec();
        return items;
    }
    async getById(id) {
        const item = await this.model.findById(id);
        return item;
    }
    async update(id, obj) {
        await this.model.findByIdAndUpdate(id, obj);
        await new this.model(obj).save();
    }
    async delete(id) {
        await this.model.findByIdAndDelete(id);
    }
}
//# sourceMappingURL=repository.js.map