const Tag_Model = require("../models/Tag.model");

//! creating a new tag by admin
exports.createTag = async (req, res) => {
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

        const tagDetails = await Tag_Model.create({
            name: name,
            description: description,
        });

        console.log("tag Details:", tagDetails);

        //return res

        return res.status(200).json({
            success: true,
            message: "Tag Created Successfully",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Error in creating Tags`,
        });
    }
};

//! Getting all tags

exports.showAllTags = async (req, res) => {
    try {
        const allTags = await Tag_Model.find(
            {},
            { name: true, description: true }
        );

        console.log("all Tags: ",allTags);

        return res.status(200).json({
            success: true,
            message: "All the Tags are returned successfully.",
        
        });
    } catch (error) {
        console.log("Error in getting all tags: ", error);
        return res.status(500).json({
            success: false,
            message: "Error in Getting all Tags",
        });
    }
};
