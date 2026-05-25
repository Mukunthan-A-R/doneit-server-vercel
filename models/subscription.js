const { connectDB } = require("../db/db");

const createSubscription = async (userId) => {
  const client = await connectDB();
  const insertQuery = `
    INSERT INTO user_subscriptions (user_id, plan_name, start_date, end_date, is_active)
    VALUES ($1, 'free', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '30 days', TRUE)
    RETURNING *;
  `;
  try {
    const result = await client.query(insertQuery, [userId]);
    return {
      success: true,
      status: 201,
      message: "Subscription created",
      data: result.rows[0],
    };
  } catch (err) {
    console.error("Error in createSubscription:", err);
    return {
      success: false,
      status: 500,
      message: "Failed to create subscription",
      error: err.message,
    };
  } finally {
    client.release();
  }
};

const getSubscriptionByUserId = async (userId) => {
  const client = await connectDB();
  const query = `
    SELECT * FROM user_subscriptions
    WHERE user_id = $1
    ORDER BY start_date DESC
    LIMIT 1
  `;

  try {
    const result = await client.query(query, [userId]);
    if (result.rowCount === 0) {
      return {
        success: false,
        status: 404,
        message: "No subscription found for this user",
      };
    }

    return {
      success: true,
      status: 200,
      message: "Subscription fetched successfully",
      data: result.rows[0],
    };
  } catch (err) {
    console.error("Error in getSubscriptionByUserId:", err);
    return {
      success: false,
      status: 500,
      message: "Error fetching subscription",
      error: err.message,
    };
  } finally {
    client.release();
  }
};

module.exports = {
  createSubscription,
  getSubscriptionByUserId,
};
