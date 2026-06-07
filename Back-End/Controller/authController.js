const UserLogin = require("../Models/LogInSchema");
const AsyncErrorHandler = require("../Utils/AsyncErrorHandler");
const axios = require("axios");
const CustomError = require("../Utils/CustomError");
const jwt = require("jsonwebtoken");
const util = require("util");
const fs = require("fs");
const FormData = require("form-data");
const crypto = require("crypto");

const signToken = (id, role, linkId) => {
  return jwt.sign({ id, role, linkId }, process.env.SECRET_STR, {
    expiresIn: "12h",
  });
};

exports.DisplayProfile = AsyncErrorHandler(async (req, res) => {
  const loggedInUserId = req.user.linkId;

  // Hanapin sa User model (hindi na Admin/Officer/Approver)
  let user = await UserLogin.findById(loggedInUserId);

  if (!user) {
    return res.status(404).json({
      status: "fail",
      message: "Profile not found",
    });
  }

  res.status(200).json({
    status: "success",
    data: user,
  });
});

exports.signup = AsyncErrorHandler(async (req, res) => {
  try {
    const {
      contact_number,
      first_name,
      last_name,
      email,
      role,
      Position,
      gender,
      middle_name,
      detailInfo,
      district,
      term_from,
      term_to,
      term,
      priorityNumber,
      isExOfficial,
      selectedYearFrom,
      selectedYearTo,
      subPosition,
      summary
    } = req.body;

    console.log("========================================");
    console.log("📦 REQUEST BODY");
    console.log("========================================");
    console.log("Summary type:", typeof summary);
    console.log("Summary value:", summary);
    console.log("========================================");

    const isExOfficialBoolean = isExOfficial === "true" || isExOfficial === true;
    console.log("isExOfficial:", isExOfficialBoolean);

    const defaultPassword = "123456789";

    // --- Validate required fields ---
    const requiredFields = ["first_name", "last_name", "email"];
    const missingFields = requiredFields.filter((field) => !req.body[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        message: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }

    // --- Check existing user ---
    const existingUser = await UserLogin.findOne({ username: email });
    if (existingUser) {
      return res.status(400).json({
        message: "User with this email already exists!",
      });
    }

    let avatar = { url: "", public_id: "" };

    // --- Upload avatar if file exists ---
    if (req.file) {
      const fileName = req.file.filename;
      const form = new FormData();
      form.append("file", fs.createReadStream(req.file.path), req.file.originalname);

      try {
        const response = await axios.post(process.env.UPLOAD_URL, form, {
          maxBodyLength: Infinity,
          headers: { "Content-Type": "multipart/form-data" },
        });

        if (!response.data.success) {
          return res.status(500).json({
            error: response.data.message || "Failed to upload avatar",
          });
        }

        avatar = {
          url: response.data.url,
          public_id: fileName,
        };

        fs.unlink(req.file.path, (err) => {
          if (err) console.error("Failed to delete temp file:", err);
        });

        console.log("✅ Avatar uploaded:", avatar.url);
      } catch (err) {
        console.error("❌ Upload failed:", err.response?.data || err.message);
        return res.status(500).json({ error: "Failed to upload avatar image" });
      }
    }

    // --- Create user profile (general user) ---
    const profileData = {
      avatar,
      first_name,
      last_name,
      middle_name: middle_name || "",
      email,
      contact_number: contact_number || "",
      gender: gender || "",
      Position: Position || "",
      detailInfo: detailInfo || "",
      district: district || "",
      term_from: term_from || "",
      term_to: term_to || "",
      term: term || "",
      priorityNumber: priorityNumber || "",
      isExOfficial: isExOfficialBoolean,
      subPosition: subPosition || "",
    };

    // ========================================
    // SUMMARY PROCESSING WITH SPECIFICNAME
    // ========================================
    let processedSummary = [];

    if (summary) {
      console.log("🔍 Processing summary...");
      console.log("Type:", typeof summary);

      if (typeof summary === 'string') {
        const trimmed = summary.trim();
        
        if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
          try {
            const parsed = JSON.parse(trimmed);
            console.log("✅ Parsed JSON:", Array.isArray(parsed) ? `Array(${parsed.length})` : 'Object');
            
            if (Array.isArray(parsed)) {
              processedSummary = parsed
                .filter(item => item && typeof item === 'object')
                .map(item => ({
                  title: String(item.title || "").trim(),
                  subTitle: Array.isArray(item.subTitle) 
                    ? item.subTitle.filter(s => s).map(s => String(s).trim())
                    : [],
                  specificname: item.specificname || ""
                }));
            } else if (parsed && typeof parsed === 'object') {
              processedSummary = [{
                title: String(parsed.title || "").trim(),
                subTitle: Array.isArray(parsed.subTitle) 
                  ? parsed.subTitle.filter(s => s).map(s => String(s).trim())
                  : [],
                specificname: parsed.specificname || ""
              }];
            }
          } catch (e) {
            console.log("⚠️ Parse failed:", e.message);
            if (!trimmed.includes('[object Object]')) {
              processedSummary = [{ 
                title: trimmed, 
                subTitle: [],
                specificname: ""
              }];
            }
          }
        } else if (!trimmed.includes('[object Object]')) {
          processedSummary = [{ 
            title: trimmed, 
            subTitle: [],
            specificname: ""
          }];
        }
      }
      else if (Array.isArray(summary)) {
        processedSummary = summary
          .filter(item => item && typeof item === 'object')
          .map(item => ({
            title: String(item.title || "").trim(),
            subTitle: Array.isArray(item.subTitle) 
              ? item.subTitle.filter(s => s).map(s => String(s).trim())
              : [],
            specificname: item.specificname || ""
          }));
      }
      else if (typeof summary === 'object' && summary.title) {
        processedSummary = [{
          title: String(summary.title || "").trim(),
          subTitle: Array.isArray(summary.subTitle) 
            ? summary.subTitle.filter(s => s).map(s => String(s).trim())
            : [],
          specificname: summary.specificname || ""
        }];
      }
    }

    profileData.summary = processedSummary;
    console.log("📋 Final summary count:", profileData.summary.length);
    console.log("📋 Final summary:", JSON.stringify(profileData.summary, null, 2));
    console.log("========================================");

    // ✅ Ex-Official year_from/year_to
    if (isExOfficialBoolean === true) {
      if (selectedYearFrom && selectedYearTo) {
        profileData.year_from = selectedYearFrom;
        profileData.year_to = selectedYearTo;
      } else if (req.body.year_from && req.body.year_to) {
        profileData.year_from = req.body.year_from;
        profileData.year_to = req.body.year_to;
      }
    }

    // Create user in User model (general)
    const linkedRecord = await User.create(profileData);
    console.log("✅ User saved!");
    console.log("✅ Summary in DB:", JSON.stringify(linkedRecord.summary, null, 2));

    // Create login credentials
    const newUserLogin = await UserLogin.create({
      avatar,
      first_name,
      last_name,
      username: email,
      contact_number,
      password: defaultPassword,
      role: role || "user", // Default role is "user"
      linkedId: linkedRecord._id,
      isVerified: true,
    });

    res.status(201).json({
      status: "Success",
      user: newUserLogin,
      profile: linkedRecord,
    });

    // Emit socket event for new user
    const io = req.app.get("io");
    io.emit("newUserSignup", {
      role: role || "user",
      user: { id: newUserLogin._id, first_name, last_name, email, role: role || "user" },
      profile: { id: linkedRecord._id, first_name, last_name, Position: linkedRecord.Position || null },
      createdAt: new Date(),
    });

  } catch (error) {
    console.error("❌ Signup failed:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

exports.login = AsyncErrorHandler(async (req, res, next) => {
  const { email, password } = req.body;

  console.log(req.body)

  const user = await UserLogin.findOne({ username: email }).select("+password");

  if (!user || !(await user.comparePasswordInDb(password, user.password))) {
    return next(new CustomError("Incorrect email or password", 400));
  }


  let linkId = user.linkedId || user._id;

  // Generate token with role and linkId
  const token = signToken(user._id, user.role, linkId);

  req.session.userId = user._id;
  req.session.isLoggedIn = true;
  req.session.user = {
    email: user.username,
    first_name: user.first_name,
    last_name: user.last_name,
    role: user.role,
    linkId,
    theme: user.theme,
  };

  return res.status(200).json({
    status: "Success",
    userId: user._id,
    linkId,
    role: user.role,
    token,
    email: user.username,
    first_name: user.first_name,
    last_name: user.last_name,
    theme: user.theme,
  });
});

exports.logout = AsyncErrorHandler((req, res, next) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).send("Logout failed.");
    res.clearCookie("connect.sid");
    res.send("Logged out successfully!");
  });
});

exports.verifyOtp = AsyncErrorHandler(async (req, res, next) => {
  const { otp, userId } = req.body;

  if (!otp || !userId) {
    return res.status(400).json({
      message: "Both OTP and userId are required.",
    });
  }

  const user = await UserLogin.findById(userId);

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  if (user.isVerified) {
    return res.status(400).json({ message: "User is already verified" });
  }
  
  if (user.otp !== otp || user.otpExpiresAt < Date.now()) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }
  
  user.isVerified = true;
  user.otp = undefined;
  user.otpExpiresAt = undefined;
  await user.save();

  return res.status(200).json({
    message: "Email Verified Successfully",
    data: {
      _id: user._id,
      username: user.username,
      role: user.role,
      isVerified: user.isVerified,
    },
  });
});

exports.protect = AsyncErrorHandler(async (req, res, next) => {
  // 1. Check if user is logged in via session
  if (req.session && req.session.isLoggedIn && req.session.user) {
    req.user = req.session.user;
    return next();
  }

  // 2. If no session, fallback to token (JWT) authentication
  const authHeader = req.headers.authorization;
  let token;

  if (authHeader && authHeader.startsWith("Bearer")) {
    token = authHeader.split(" ")[1];
  }

  if (!token) {
    return next(new CustomError("You are not logged in!", 401));
  }

  // 3. Verify JWT token
  const decoded = await util.promisify(jwt.verify)(
    token,
    process.env.SECRET_STR,
  );

  const user = await UserLogin.findById(decoded.id);
  if (!user) {
    return next(new CustomError("User no longer exists", 401));
  }

  // 4. Check if password changed after token was issued
  const isPasswordChanged = await user.isPasswordChanged(decoded.iat);
  if (isPasswordChanged) {
    return next(new CustomError("Password changed. Login again.", 401));
  }

  // 5. Set linkedId and assign user to req.user
  const linkId = user.linkedId || user._id;

  req.user = {
    _id: user._id,
    email: user.username,
    role: user.role,
    first_name: user.first_name,
    last_name: user.last_name,
    linkId,
  };

  next();
});

exports.restrict = (...roles) => {
  return (req, res, next) => {
    if (!req.session?.isLoggedIn || !roles.includes(req.session.user.role)) {
      return res
        .status(403)
        .json({ message: `Access denied. Required roles: ${roles.join(", ")}` });
    }
    next();
  };
};

exports.forgotPassword = AsyncErrorHandler(async (req, res, next) => {
  const { email } = req.body;

  const user = await UserLogin.findOne({ username: email });

  if (!user) {
    return next(
      new CustomError("We could not find the user with given email", 404),
    );
  }

  const resetToken = user.createResetTokenPassword();
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
  const message = `We have received a password reset request. Please use the below link to reset your password:\n\n${resetUrl}\n\nThis link will expire in 10 minutes.`;

  try {

    res.status(200).json({
      status: "Success",
      message: "Password reset link sent to the user email",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new CustomError(
        "There was an error sending password reset email. Please try again later",
        500,
      ),
    );
  }
});

exports.resetPassword = AsyncErrorHandler(async (req, res, next) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await UserLogin.findOne({
    passwordResetToken: hashedToken,
    passwordResetTokenExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new CustomError("Invalid or expired token.", 400));
  }

  user.password = req.body.password;
  user.passwordResetToken = undefined;
  user.passwordResetTokenExpires = undefined;
  user.passwordChangedAt = Date.now();
  await user.save();

  return res.status(200).json({
    status: "Success",
  });
});

exports.updatePassword = AsyncErrorHandler(async (req, res, next) => {
  const user = await UserLogin.findById(req.user._id).select("+password");

  if (!user) {
    return next(new CustomError("User not found.", 404));
  }

  const isMatch = await user.comparePasswordInDb(
    req.body.currentPassword,
    user.password,
  );
  
  if (!isMatch) {
    return next(
      new CustomError("The current password you provided is wrong", 401),
    );
  }

  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  await user.save();

  const token = signToken(user._id, user.role, user.linkedId);
  
  res.status(200).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
});

exports.UpdateAvatar = AsyncErrorHandler(async (req, res) => {
  console.log("req", req.body);
  const userId = req.user.linkId;

  console.log("userId", userId);

  // Hanapin sa User model (general)
  let user = await User.findById(userId);

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  if (!req.file) {
    return res.status(400).json({ error: "Avatar image is required" });
  }

  const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
  if (!allowedTypes.includes(req.file.mimetype)) {
    fs.unlink(req.file.path, () => { });
    return res.status(400).json({ error: "Invalid image type" });
  }

  const oldAvatarUrl = user.avatar?.url || null;
  let newAvatarUrl = null;

  try {
    const form = new FormData();
    form.append("file", fs.createReadStream(req.file.path), {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });

    const uploadResponse = await axios.post(
      "https://bp-sangguniangpanlalawigan.com/upload.php",
      form,
      {
        headers: form.getHeaders(),
        maxBodyLength: Infinity,
      },
    );

    if (!uploadResponse.data.success) {
      throw new Error(uploadResponse.data.message || "Upload failed");
    }

    newAvatarUrl = uploadResponse.data.url;

    user.avatar = {
      ...user.avatar,
      url: newAvatarUrl,
    };

    await user.save();

    res.status(200).json({
      status: true,
      message: "User avatar updated successfully",
      data: user,
    });

    if (oldAvatarUrl) {
      const params = new URLSearchParams();
      params.append("file", oldAvatarUrl);

      axios
        .post(
          "https://bp-sangguniangpanlalawigan.com/delete.php",
          params.toString(),
          { headers: { "Content-Type": "application/x-www-form-urlencoded" } },
        )
        .catch(() => { });
    }
  } catch (error) {
    console.error("UpdateUserAvatar Error:", error);
    res.status(500).json({ error: "Something went wrong." });
  } finally {
    if (req.file) {
      fs.unlink(req.file.path, () => { });
    }
  }
});

exports.UpdateProfileInfo = AsyncErrorHandler(async (req, res) => {
  const userId = req.params.id;

  // Hanapin sa User model
  let user = await User.findById(userId);

  if (!user) {
    return res.status(404).json({
      error: "User not found",
    });
  }

  try {
    const { first_name, last_name, middle_name, email, contact_number, gender, Position } = req.body;

    const updateData = {
      first_name,
      last_name,
      middle_name,
      email,
      contact_number,
      gender,
      Position,
    };

    // Remove undefined fields
    Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    );

    // Also update UserLogin if email changed
    if (email) {
      await UserLogin.findOneAndUpdate(
        { linkedId: userId },
        { username: email, first_name, last_name }
      );
    }

    res.status(200).json({
      status: "success",
      message: "Profile updated successfully",
      data: updatedUser,
    });

  } catch (error) {
    console.error("UpdateProfileInfo Error:", error);
    res.status(500).json({ error: "Something went wrong." });
  }
});