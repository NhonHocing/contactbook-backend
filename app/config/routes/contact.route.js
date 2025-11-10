const express = require("express");
const contacts = require("../controllers/contact.controller");

const router = express.Router();

// /api/contacts/
router
  .route("/")
  .get(contacts.findAll)
  .post(contacts.create)
  .delete(contacts.deleteAll);

// /api/contacts/favorite
router.route("/favorite").get(contacts.findAllFavorite);

// /api/contacts/:id
router
  .route("/:id")
  .get(contacts.findOne)
  .put(contacts.update)
  .delete(contacts.delete);

module.exports = router;
