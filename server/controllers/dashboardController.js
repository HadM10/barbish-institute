// server/controllers/statsController.js
const sequelize = require("../config/db");

exports.getStats = async (req, res) => {
  try {
    const result = await sequelize.query(
      `
      SELECT 
        (SELECT COUNT(*) FROM Users) AS totalUsers,
        (SELECT COUNT(*) FROM Users WHERE isActive = 1) AS activeUsers,
        (SELECT COUNT(*) FROM Categories) AS totalCategories,
        (SELECT COUNT(*) FROM Sessions) AS totalSessions,
        (SELECT COUNT(*) FROM contactus) AS totalMessages,
        (SELECT SUM(amount) FROM Subscriptions) AS totalRevenue,
        (SELECT COUNT(*) FROM Courses) AS totalCourses,
        (SELECT COUNT(*) FROM Subscriptions) AS totalSubscriptions
    `,
      { type: sequelize.QueryTypes.SELECT }
    );

    const stats = result[0];
    res.status(200).send({ success: true, data: stats });
  } catch (error) {
    console.error("Error fetching stats:", error); // Log the full error
    res.status(500).send({
      success: false,
      message: "Failed to fetch stats.",
      error: error.message,
    });
  }
};
