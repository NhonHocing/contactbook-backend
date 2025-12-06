const { ObjectId } = require("mongodb");

class ContactService {
  // Phương thức kết nối với database
  constructor(client) {
    this.Contact = client.db().collection("contacts");
  }

    // ----------------------------------------Định nghĩa phương thức findAll
    async find(filter) {
        const cursor = await this.Contact.find(filter);
        return await cursor.toArray();
    }

    async findByName(name) {
        return await this.find({
            name: { $regex: new RegExp(name), $options: "i" },
        });
    }

    async findById(id) {
      return await this.Contact.findOne({
          _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
      });
  }

  // Hàm cập nhật contact theo id
  async update(id, payload) {
    const filter = {
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    };

    const updateDoc = {
      $set: {
        ...payload,
      },
    };

    const result = await this.Contact.findOneAndUpdate(
      filter,
      updateDoc,
      { returnDocument: "after" } // trả về document sau khi update
    );

    if (!result) return null;
    // driver v7 có thể trả trực tiếp document thay vì { value }
    return result.value ?? result;
  }

  // Định nghĩa các phương thức truy xuất CSDL sử dụng mongodb API

  // ---------------------------------------Định nghĩa phương thức create
  extractContactData(payload) {
    const contact = {
      name: payload.name,
      email: payload.email,
      address: payload.address,
      phone: payload.phone,
      favorite: payload.favorite,
    };

    // Remove undefined fields
    Object.keys(contact).forEach(
      (key) => contact[key] === undefined && delete contact[key]
    );

    return contact;
  }

  async create(payload) {
    const contact = this.extractContactData(payload);
    const result = await this.Contact.findOneAndUpdate(
      contact,
      { $set: { favorite: contact.favorite === true } },
      { returnDocument: "after", upsert: true }
    );

    return result;
  }

  async delete(id) {
    const result = await this.Contact.findOneAndDelete({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
    return result;
  }

  async findFavorite() {
    return await this.find({ favorite: true });
  }

  async deleteAll() {
    const result = await this.Contact.deleteMany({});
    return result.deletedCount;
  }
}

module.exports = ContactService;
