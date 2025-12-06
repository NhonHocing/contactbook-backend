const ContactService = require("../services/contact.services");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../routes/api-error");

// Hàm tìm tất cả contact
// Retrieve all contacts of a user from the database
exports.findAll = async (req, res, next) => {
  let documents = [];

  try {
      const contactService = new ContactService(MongoDB.client);
      const { name } = req.query;
      if (name) {
          documents = await contactService.findByName(name);
      } else {
          documents = await contactService.find({});
      }
  } catch (error) {
      return next(
          new ApiError(500, "An error occurred while retrieving contacts")
      );
  }

  return res.send(documents);
};

// Hàm tìm contact theo id
exports.findOne = async (req, res, next) => {
  try {
      const contactService = new ContactService(MongoDB.client);
      const document = await contactService.findById(req.params.id);
      if (!document) {
          return next(new ApiError(404, "Contact not found"));
      }
      return res.send(document);
  } catch (error) {
      return next(
          new ApiError(500, `Error retrieving contact with id=${req.params.id}`)
      );
  }
};


// Hàm tạo mới contact
exports.create = async (req, res, next) => {
  if (!req.body?.name) {
    return next(new ApiError(400, "Name can not be empty"));
  }

  try {
    const contactService = new ContactService(MongoDB.client);
    const document = await contactService.create(req.body);
    return res.send(document);
  } catch (error) {
    return next(
      new ApiError(500, "An error occurred while creating the contact")
    );
  }
};


// Hàm cập nhật contact theo id
exports.update = async (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    return next(new ApiError(400, "Data to update can not be empty"));
  }

  try {
    const contactService = new ContactService(MongoDB.client);
    const document = await contactService.update(req.params.id, req.body);
    if (!document) {
      return next(new ApiError(404, "Contact not found"));
    }

    return res.send({ message: "Contact was updated successfully" });
  } catch (error) {
    return next(
      new ApiError(500, `Error updating contact with id=${req.params.id}`)
    );
  }
};


// Hàm xóa contact theo id
exports.delete = async (req, res, next) => {
  try {
    const contactService = new ContactService(MongoDB.client);
    const document = await contactService.delete(req.params.id);
    if (!document) {
      return next(new ApiError(404, "Contact not found"));
    }
    return res.send({ message: "Contact was deleted successfully" });
  } catch (error) {
    return next(
      new ApiError(500, `Error deleting contact with id=${req.params.id}`)
    );
  }
};

// Hàm xóa tất cả contact
exports.deleteAll = async (_req, res, next) => {
  try {
    const contactService = new ContactService(MongoDB.client);
    const deletedCount = await contactService.deleteAll();
    return res.send({
      message: `${deletedCount} contacts were deleted successfully`,
    });
  } catch (error) {
    return next(
      new ApiError(500, "An error occurred while removing all contacts")
    );
  }
};

// Hàm lấy tất cả contact được đánh dấu yêu thích
exports.findAllFavorite = async (_req, res, next) => {
  try {
    const contactService = new ContactService(MongoDB.client);
    const documents = await contactService.findFavorite();
    return res.send(documents);
  } catch (error) {
    return next(
      new ApiError(500, "An error occurred while retrieving favorite contacts")
    );
  }
};
