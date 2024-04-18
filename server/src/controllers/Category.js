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

        // console.log("category Details:", categoryDetails);

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

        // console.log("all categories: ", allCategories);

        return res.status(200).json({
            success: true,
            message: "All the categories are returned successfully.",
            data: allCategories,
        });
    } catch (error) {
        console.log("Error in getting all categories: ", error);
        return res.status(500).json({
            success: false,
            message: "Error in Getting all categories",
        });
    }
};

exports.categoryPageDetails = async (req, res) => {
    try {
        //get the data
        const { categoryId } = req.body;

        //get top selling courses
        const selectCategory = await Category_Model.findById(categoryId)
            .populate({
                path: "course",
                match: { status: "Published" },
                populate: "ratingAndReviews",
            })
            .exec();

        //validate
        if (!selectCategory) {
            return res.status(404).json({
                success: false,
                message: "Category not found.",
            });
        }

        if (selectCategory.courses.length === 0) {
            console.log("No course found in this category");
            return res.status(404).json({
                success: false,
                message: "No course found in this category",
            });
        }

        //get courses for different category if searched category not found
        const notSelectedCategories = await Category_Model.find({
            _id: { $ne: categoryId },
        });
        let differentCategory = await Category_Model.findOne(
            notSelectedCategories(getRandomInt(notSelectedCategories.length))
                ._id
        )
            .populate({
                path: "courses",
                match: { status: "Published" },
            })
            .exec();

        const allCategories = await Category_Model.find()
            .populate({
                path: "courses",
                match: { status: "Published" },
            })
            .exec();

        const allCourses = allCategories.flatMap(
            (category) => category.courses
        );
        const mostSellingCourses = allCourses
            .sort((a, b) => b.sold - a.sold)
            .slice(0, 10);

        //return
        return res.status(200).json({
            success: true,
            message: "Category Page Data fetched Successfully.",
            data: {
                selectCategory,
                differentCategory,
                mostSellingCourses,
            },
        });
    } catch (error) {
        console.log("Error in category page courses".error);
        return res.status(500).json({
            success: false,
            message: "Error in getting page details",
            error: error.message,
        });
    }
};
