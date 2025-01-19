// server/controllers/statsController.js
const sequelize = require("../config/db");

// Get most subscribed courses
exports.getMostSubCourses = async (req, res) => {
  try {
    // SQL query to get the top 3 most subscribed courses with all attributes from the Course model
    const result = await sequelize.query(
      `
      SELECT 
        c.*, 
        COUNT(s.courseId) AS subscriptionCount
      FROM Courses c
      LEFT JOIN Subscriptions s ON c.id = s.courseId
      GROUP BY c.id
      ORDER BY subscriptionCount DESC
      LIMIT 3
    `,
      { type: sequelize.QueryTypes.SELECT }
    );

    // If no courses are found
    if (result.length === 0) {
      return res.status(404).json({ error: "No subscribed courses found" });
    }

    // Send the result back to the client
    res.status(200).send(result);
  } catch (error) {
    console.error("Error fetching top subscribed courses:", error);
    res.status(500).send({ error: "Failed to fetch top subscribed courses" });
  }
};
