const express = require('express');
const ApiError = require('../routes/api-error');
const ContactService = require('../services/contact.services'); // Import ContactService
const MongoDB = require('../utils/mongodb.util'); // Import MongoDB
const contactController = require('../controllers/contact.controller'); // Import controller
const router = express.Router();

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Route GET để lấy tất cả contact
router.get('/', asyncHandler(async (req, res, next) => {
  if (!MongoDB.client) {
    return next(new ApiError(500, "Database connection not established"));
  }
  
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
    console.error("Error in GET /api/contacts:", error);
    return next(new ApiError(500, "An error occurred while retrieving contacts"));
  }
  
  return res.send(documents);
}));

// Route GET để lấy tất cả contact được đánh dấu yêu thích
router.get('/favorite/all', contactController.findAllFavorite);
router.get('/favorite', contactController.findAllFavorite);

// Route GET để lấy contact theo id
router.get('/:id', asyncHandler(async (req, res, next) => {
  if (!MongoDB.client) {
    return next(new ApiError(500, "Database connection not established"));
  }

  try {
    const contactService = new ContactService(MongoDB.client);
    const document = await contactService.findById(req.params.id);
    if (!document) {
      return next(new ApiError(404, "Contact not found"));
    }
    return res.send(document);
  } catch (error) {
    console.error("Error in GET /api/contacts/:id:", error);
    return next(new ApiError(500, "An error occurred while retrieving the contact"));
  }
}));

// Route POST để tạo contact mới
router.post('/', asyncHandler(async (req, res, next) => {
  if (!MongoDB.client) {
    return next(new ApiError(500, "Database connection not established"));
  }

  const body = req.body || {};
  if (!Object.keys(body).length) return next(new ApiError(400, 'Request body can not be empty'));
  if (!body.name) return next(new ApiError(400, 'Name can not be empty'));
  if (!body.email) return next(new ApiError(400, 'Email can not be empty'));

  try {
    const contactService = new ContactService(MongoDB.client);
    const document = await contactService.create(body);
    return res.status(201).json(document);
  } catch (error) {
    console.error("Error in POST /api/contacts:", error);
    return next(new ApiError(500, "An error occurred while creating the contact"));
  }
}));

// Route PUT để cập nhật contact theo id
router.put('/:id', asyncHandler(async (req, res, next) => {
  if (!MongoDB.client) {
    return next(new ApiError(500, "Database connection not established"));
  }

  const body = req.body || {};
  if (!Object.keys(body).length) {
    return next(new ApiError(400, "Update data can not be empty"));
  }

  try {
    const contactService = new ContactService(MongoDB.client);
    const updated = await contactService.update(req.params.id, body);
    if (!updated) {
      return next(new ApiError(404, "Contact not found"));
    }
    return res.json({ message: "Contact was updated successfully" });
  } catch (error) {
    console.error("Error in PUT /api/contacts/:id:", error);
    return next(new ApiError(500, "An error occurred while updating the contact"));
  }
}));

// Route DELETE để xóa tất cả contact
router.delete('/', contactController.deleteAll);

// Route DELETE để xóa contact theo id
router.delete('/:id', asyncHandler(async (req, res, next) => {
  if (!MongoDB.client) {
    return next(new ApiError(500, "Database connection not established"));
  }

  try {
    const contactService = new ContactService(MongoDB.client);
    const document = await contactService.delete(req.params.id);
    if (!document) {
      return next(new ApiError(404, "Contact not found"));
    }
    return res.json({ message: "Contact was deleted successfully" });
  } catch (error) {
    console.error("Error in DELETE /api/contacts/:id:", error);
    return next(new ApiError(500, "An error occurred while deleting the contact"));
  }
}));

module.exports = router;
