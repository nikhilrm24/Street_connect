const { createUser, findUserByEmail} = require("../models/userModel");
const { createVendor } = require("../models/vendorModel");
const bcrypt=require("bcrypt");
const AppError=require("../utils/AppError")
const jwt=require("jsonwebtoken");
require("dotenv").config();

async function addUser(req, res, next) {
  try {
    const {
      name,
      email,
      password,
      role,
      business_name,
      category,
      phone,
      location_info,
      delivary_info
    } = req.body;

    const shop_image = req.file
      ? `/uploads/${req.file.filename}`
      : null;

    const user = await createUser(
      name,
      email,
      password,
      role
    );

    if (!user) {
      throw new AppError("User cannot be created", 404);
    }

    if (role === "vendor") {
      await createVendor(
        user.id,
        business_name,
        category,
        phone,
        location_info,
        delivary_info,
        shop_image
      );
    }

    res.status(201).json({
      message: "Successfully registered"
    });

  } catch (e) {
    if (e.code === "23505") {
      return next(
        new AppError("Email already registered", 409)
      );
    }

    next(e);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    const user = await findUserByEmail(email);

    if (!user) {
      throw new AppError("user not found", 404);
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new AppError("invalid password", 403);
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (e) {
    next(e);
  }
}



module.exports={addUser,login};