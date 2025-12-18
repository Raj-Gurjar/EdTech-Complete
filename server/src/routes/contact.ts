import express, { Router } from "express";
const router: Router = express.Router();

const {
    createContactUs,
} = require("../controllers/Contact");

//! Routes for contact us

router.post("/contact", createContactUs);

module.exports = router;

