const UserLogin = require("../Models/LogInSchema");
const mongoose = require('mongoose');

const initDefaultUser = async () => {
  try {
    // Check if UserLogin is properly loaded
    if (!UserLogin) {
      console.error("❌ UserLogin model is not defined!");
      return;
    }

    // Check if countDocuments function exists
    if (typeof UserLogin.countDocuments !== 'function') {
      console.error("❌ UserLogin.countDocuments is not a function. Model may not be properly initialized.");
      console.log("UserLogin object:", UserLogin);
      return;
    }

    const userCount = await UserLogin.countDocuments();
    console.log(`📊 Current user count: ${userCount}`);

    if (userCount === 0) {
      console.log("🛠 Creating default admin account...");

      // Validate required environment variables
      if (!process.env.DEFAULT_ADMIN_EMAIL || !process.env.DEFAULT_ADMIN_PASSWORD) {
        console.error("❌ Missing required environment variables for default admin!");
        console.log("Required: DEFAULT_ADMIN_EMAIL, DEFAULT_ADMIN_PASSWORD");
        return;
      }

      const defaultAdmin = new UserLogin({
        first_name: process.env.DEFAULT_ADMIN_FIRSTNAME || "Admin",
        last_name: process.env.DEFAULT_ADMIN_LASTNAME || "User",
        username: process.env.DEFAULT_ADMIN_EMAIL,
        password: process.env.DEFAULT_ADMIN_PASSWORD,
        confirmPassword: process.env.DEFAULT_ADMIN_PASSWORD,
        role: "admin",
        contact_number: process.env.DEFAULT_ADMIN_CONTACT || 9999999999,
        theme: process.env.DEFAULT_ADMIN_THEME || "light",
      });

      const savedAdmin = await defaultAdmin.save();
      console.log("✅ Default admin account created with ID:", savedAdmin._id);

      savedAdmin.linkedId = savedAdmin._id;
      await savedAdmin.save();
      console.log("✅ Default admin account created with linkedId!");
    } else {
      console.log("🔍 Admin account already exists.");
    }
  } catch (error) {
    console.error("❌ Error in initDefaultUser:", error.message);
    console.error("Stack trace:", error.stack);
  }
};

module.exports = initDefaultUser;