const express = require("express");
const router = express.Router();

const {
   createCourse,
   getAllCourse,
   getCourseById
} = require("../controllers/Course");


const { auth } = require("../middlewares/auth");

//!Routes for creating , getting all and getting by id of instructor course
router.post("/createCourse",auth, createCourse);


module.exports = router;
