const AsyncErrorHandler = require("../Utils/AsyncErrorHandler");
const QmsCornerModel = require("../Models/QMScorner");

// CREATE
exports.createQmsCorner = AsyncErrorHandler(async (req, res) => {
    console.log("Middleware Called");
    console.log(req.body);

    const { title, googleLink } = req.body;

    if (!title || !googleLink || googleLink.length === 0) {
        return res.status(400).json({
            success: false,
            message: "Title and Google Link are required",
        });
    }

    const qmsCorner = await QmsCornerModel.create({
        title,
        googleLink,
    });

    return res.status(201).json({
        status: "success",
        message: "QMS Corner created successfully",
        data: qmsCorner,
    });
});

// DISPLAY ALL (WITH PAGINATION + SEARCH)
exports.DisplayQmsCorner = AsyncErrorHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const skip = (page - 1) * limit;

    const { search } = req.query;

    const matchStage = {};

    if (search) {
        matchStage.title = {
            $regex: search.trim(),
            $options: "i",
        };
    }

    const result = await QmsCornerModel.aggregate([
        { $match: matchStage },
        { $sort: { createdAt: -1 } },
        {
            $facet: {
                data: [
                    { $skip: skip },
                    { $limit: limit },
                    {
                        $project: {
                            _id: 1,
                            title: 1,
                            googleLink: 1,
                            createdAt: 1,
                            updatedAt: 1,
                        },
                    },
                ],
                totalCount: [{ $count: "count" }],
            },
        },
    ]);

    const qmsCorners = result[0].data || [];
    const totalCount = result[0].totalCount[0]?.count || 0;

    res.status(200).json({
        status: "success",
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalCount,
        results: qmsCorners.length,
        data: qmsCorners,
    });
});

// UPDATE
exports.updateQmsCorner = AsyncErrorHandler(async (req, res) => {
    const qmsCorner = await QmsCornerModel.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
            new: true,
            runValidators: true,
        }
    );

    if (!qmsCorner) {
        return res.status(404).json({
            status: "fail",
            message: "QMS Corner not found",
        });
    }

    res.status(200).json({
        status: "success",
        message: "QMS Corner updated successfully",
        data: qmsCorner,
    });
});

// DELETE
exports.deleteQmsCorner = AsyncErrorHandler(async (req, res) => {
    const qmsCorner = await QmsCornerModel.findById(req.params.id);

    if (!qmsCorner) {
        return res.status(404).json({
            status: "fail",
            message: "QMS Corner not found",
        });
    }

    await QmsCornerModel.findByIdAndDelete(req.params.id);

    res.status(200).json({
        status: "success",
        message: "QMS Corner deleted successfully",
    });
});