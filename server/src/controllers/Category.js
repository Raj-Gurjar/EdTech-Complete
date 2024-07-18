const Category_Model = require("../models/Category.model");

//! creating a new category by admin
exports.createCategory = async (req, res) => {
    try {
        //get data
        console.log("in cc");

        const { categoryName, categoryDescription } = req.body;

        console.log("rr b", req.body);

        //validation
        if (!categoryName || !categoryDescription) {
            return res.status(400).json({
                success: false,
                message: "All fields are required.",
            });
        }

        //check if category already present

        const catPresent = await Category_Model.findOne({
            name: categoryName,
        });

        if (catPresent) {
            return res.status(400).json({
                success: false,
                message: "Category is Already Present",
            });
        }

        //TODO : check description length and name length

        //create entry

        const categoryDetails = await Category_Model.create({
            name: categoryName,
            description: categoryDescription,
        });

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
        const allCategories = await Category_Model.find({}, {});

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
    function getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }

    try {
        //get the data
        // console.log("Entering cat page controller");
        const { categoryId } = req.body;
        //get top selling courses
        const selectedCategory = await Category_Model.findById(categoryId)
            .populate({
                path: "courses",
                match: { status: "Published" },
                populate: "ratingAndReviews",
                populate: {
                    path: "instructor",
                },
            })
            .exec();
        // console.log("selected course:", selectedCategory);
        //validate
        if (!selectedCategory) {
            return res.status(404).json({
                success: false,
                message: "Category not found.",
            });
        }

        if (selectedCategory.courses.length === 0) {
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

        // console.log("not Selected Cat: ", notSelectedCategories);
        let differentCategory = await Category_Model.findOne(
            notSelectedCategories[getRandomInt(notSelectedCategories.length)]
                ._id
        )
            .populate({
                path: "courses",
                match: { status: "Published" },
                populate: {
                    path: "instructor",
                },
            })
            .exec();

        const allCategories = await Category_Model.find()
            .populate({
                path: "courses",
                match: { status: "Published" },
                populate: {
                    path: "instructor",
                },
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
                selectedCategory,
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

exports.deleteCategory = async (req, res) => {
    try {
        console.log("inside del cat");

        const { categoryId } = req.body;
        console.log("cid", categoryId);

        if (!categoryId) {
            return res.status(400).json({
                success: false,
                message: "Category not found",
            });
        }
        console.log("rr", req.body);

        await Category_Model.findByIdAndDelete(categoryId);

        return res.status(200).json({
            success: true,
            message: "Category Deleted Successfully",
        });
    } catch (error) {
        console.log("error in category deletion:", error);
        return res.status(500).json({
            success: false,
            message: "Some error in Deleting the Category",
        });
    }
};
