const Category_Model = require("../models/Category.model");

//! creating a new category by admin
exports.createCategory = async (req, res) => {
    try {
        //get data

        const { name, description } = req.body;

        //validation
        if (!name || !description) {
            return res.status(400).json({
                success: false,
                message: "All fields are required.",
            });
        }

        //TODO : check description length and name length

        //create entry

        const categoryDetails = await Category_Model.create({
            name: name,
            description: description,
        });

        console.log("category Details:", categoryDetails);

        //return res

        return res.status(200).json({
            success: true,
            message: "Category Created Successfully",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Error in creating Categories`,
        });
    }
};

//! Getting all categories

exports.showAllCategories = async (req, res) => {
    try {
        const allCategories = await Category_Model.find(
            {},
            { name: true, description: true }
        );

        console.log("all categories: ", allCategories);

        return res.status(200).json({
            success: true,
            message: "All the categories are returned successfully.",
        });
    } catch (error) {
        console.log("Error in getting all categories: ", error);
        return res.status(500).json({
            success: false,
            message: "Error in Getting all categories",
        });
    }
};
