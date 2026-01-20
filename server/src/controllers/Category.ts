import { Request, Response } from "express";
const Category_Model = require("../models/Category.model");

//! creating a new category by admin
export const createCategory = async (req: Request, res: Response): Promise<Response | void> => {
    try {
        //get data

        const { categoryName, categoryDescription } = req.body;


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

export const showAllCategories = async (req: Request, res: Response): Promise<Response | void> => {
    try {
        const allCategories = await Category_Model.find({}, {});


        return res.status(200).json({
            success: true,
            data: allCategories,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error in Getting all categories",
        });
    }
};

export const categoryPageDetails = async (req: Request, res: Response): Promise<Response | void> => {
    function getRandomInt(max: number): number {
        return Math.floor(Math.random() * max);
    }

    try {
        //get the data
        const { categoryId } = req.body;
        //get top selling courses
        const selectedCategory = await Category_Model.findById(categoryId)
            .populate({
                path: "courses",
                match: { status: "Published" },
                populate: [
                    {
                        path: "ratingAndReviews",
                    },
                    {
                        path: "instructor",
                    },
                ],
            })
            .exec();
        //validate
        if (!selectedCategory) {
            return res.status(404).json({
                success: false,
                message: "Category not found.",
            });
        }

        if (selectedCategory.courses.length === 0) {
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
            (category: any) => category.courses
        );
        const mostSellingCourses = allCourses
            .sort((a: any, b: any) => b.sold - a.sold)
            .slice(0, 10);

        //return
        return res.status(200).json({
            success: true,
            data: {
                selectedCategory,
                differentCategory,
                mostSellingCourses,
            },
        });
    } catch (error: any) {  
        return res.status(500).json({
            success: false,
            message: "Error in getting page details",
            error: error.message,
        });
    }
};

export const deleteCategory = async (req: Request, res: Response): Promise<Response | void> => {
    try {

        const { categoryId } = req.body;

        if (!categoryId) {
            return res.status(400).json({
                success: false,
                message: "Category not found",
            });
        }

        await Category_Model.findByIdAndDelete(categoryId);

        return res.status(200).json({
            success: true,
            message: "Category Deleted Successfully",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Some error in Deleting the Category",
        });
    }
};

