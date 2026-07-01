const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role = "user",
    } = req.body;

    const normalizedRole =
      role === "admin" ? "admin" : "user";

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const isAdminRequest = normalizedRole === "admin";

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: normalizedRole,
      accountStatus: isAdminRequest
        ? "pending_admin_approval"
        : "active",
    });

    if (isAdminRequest) {
      //await sendAdminApprovalEmail(user);

      return res.status(201).json({
        message:
          "Admin request submitted. Your account will be active after approval.",
      });
    }

    res.status(201).json({
      message: "Registration successful",
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials"
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials"
      });
    }

    if (user.accountStatus === "pending_admin_approval") {
      return res.status(403).json({
        message:
          "Your admin account is waiting for approval.",
      });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const safeUser = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      accountStatus: user.accountStatus,
    };

    res.json({
      token,
      user: safeUser,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.approveAdmin = async (req, res) => {
  try {
    const secret =
      req.body.secret ||
      req.query.secret;

    if (!process.env.ADMIN_APPROVAL_SECRET) {
      return res.status(500).json({
        message: "Admin approval secret is not configured",
      });
    }

    if (secret !== process.env.ADMIN_APPROVAL_SECRET) {
      return res.status(403).json({
        message: "Invalid approval secret",
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.role = "admin";
    user.accountStatus = "active";

    await user.save();

    res.json({
      message: "Admin account approved",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
