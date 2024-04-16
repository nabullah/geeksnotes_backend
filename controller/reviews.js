
const { Reviews, Ratings, User } = require("../models");
const db = require("../models/index");


const ReviewsController = {
    createNewReview: async (req, res) => {
        const t = await db.sequelize.transaction();
        try {
            const { reviewText, fileId, rating } = req.body;
            const userId = req.userId;
            if (fileId) {
                const holdReviews = await Reviews.create({ reviewText, fileId, userId }, { transaction: t });
                if (!holdReviews) {
                    await t.rollback();
                    return res.status(500).json({
                        status: false, message: "We couldn't post your review. Please try again.", data: []
                    });
                }

                if (rating > 0) {
                    const holdRating = await Ratings.create({ rating: rating, fileId, userId, reviewId: holdReviews.id }, { transaction: t });
                    if (!holdRating) {
                        await t.rollback();
                        return res.status(500).json({
                            status: false, message: "We couldn't post your review. Please try again.", data: []
                        });
                    }

                    await t.commit();
                    return res.status(200).json({
                        message: "Review Created Successfully.", data: holdReviews, status: true,
                    });

                } else {
                    await t.commit();
                    return res.status(200).json({
                        message: "Review Created Successfully.", data: holdReviews, status: true,
                    });

                }
            } else {
                return res.status(500).json({
                    status: false, message: "FileId is required.", data: []
                });
            }
        } catch (error) {
            await t.rollback();
            return res.status(500).json({
                status: false,
                message: "We're experiencing technical difficulties at the moment. Please try again later or contact our support team for assistance.",
                result: error.message,
            });
        }
    },

    updateFileReview: async (req, res) => {
        const t = await db.sequelize.transaction();
        try {
            const { reviewText, fileId, rating, reviewId } = req.body;
            const userId = req.userId;
            if (reviewId) {
                const updateReviews = await Reviews.update({ reviewText: reviewText }, { where: { id: reviewId } }, { transaction: t });
                if (!updateReviews) {
                    await t.rollback();
                    return res.status(500).json({
                        status: false, message: "We couldn't post your review. Please try again.", data: []
                    });
                }

                if (rating > 0) {
                    const isRatingForReviewPresent = await Ratings.findOne({ where: { reviewId: reviewId } });
                    if (isRatingForReviewPresent) {
                        const updateRating = await Ratings.update({ rating: rating }, { where: { reviewId: reviewId } }, { transaction: t });
                        if (!updateRating) {
                            await t.rollback();
                            return res.status(500).json({
                                status: false, message: "We couldn't post your review. Please try again.", data: []
                            });
                        }
                        await t.commit();
                        return res.status(200).json({
                            message: "Review Created Successfully.", data: updateRating, status: true,
                        });

                    } else {
                        const holdRating = await Ratings.create({ rating: rating, fileId, userId, reviewId: updateReviews.id }, { transaction: t });
                        if (!holdRating) {
                            await t.rollback();
                            return res.status(500).json({
                                status: false, message: "We couldn't post your review. Please try again.", data: []
                            });
                        }

                        await t.commit();
                        return res.status(200).json({
                            message: "Review Created Successfully.", data: updateReviews, status: true,
                        });

                    }

                } else {
                    await t.commit();
                    return res.status(200).json({
                        message: "Review Created Successfully.", data: updateReviews, status: true,
                    });

                }
            } else {
                return res.status(500).json({
                    status: false, message: "ReviewId is required.", data: []
                });
            }
        } catch (error) {
            await t.rollback();
            return res.status(500).json({
                status: false,
                message: "We're experiencing technical difficulties at the moment. Please try again later or contact our support team for assistance.",
                result: error.message,
            });
        }
    },

    getReviewListForFileId: async (req, res) => {
        try {
            const { fileId } = req.query;
            if (fileId) {
                const reviewList = await Reviews.findAll({
                    where: { fileId: fileId },
                    include: [
                        { model: Ratings, as: "ratings", attributes: ["rating", "reviewId"] },
                        { model: User, as: "user", attributes: ["fullName", "color"] },
                    ]
                });
                if (!reviewList) {
                    return res.status(500).json({ status: false, message: "We couldn't get your review. Please try again.", data: [] });
                }
                return res.status(200).json({ status: true, message: "Review List", data: reviewList });

            } else {
                return res.status(500).json({ status: false, message: "FileId is required.", data: [] });
            }
        } catch (error) {
            return res.status(500).json({
                status: false,
                message: "We're experiencing technical difficulties at the moment. Please try again later or contact our support team for assistance.",
                result: error.message,
            });
        }
    }
}


module.exports = ReviewsController;
