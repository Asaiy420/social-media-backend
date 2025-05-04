import { Request, Response } from "express";
import bcryptjs from "bcryptjs";
import { db } from "../config/database.js";
import { users } from "../db/schema.js";
import { eq } from "drizzle-orm";

export const registerUser = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { username, email, password, confirmPassword } = req.body;

    if (!username || !email || !password || !confirmPassword) {
      return res
        .status(400)
        .json({ message: "All fields are required to continue" });
    }

    // check if user already exists

    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    // check if password and confirmPassword match

    if (password !== confirmPassword) {
      return res
        .status(400)
        .json({ message: "Passwords do not match please try again!" });
    }

    // hash password using bcryptjs

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this email already exists" });
    }

    // create new user

    const newUser = await db
      .insert(users)
      .values({
        username,
        email,
        password: hashedPassword,
        profilePicUrl: "https://avatar.iran.liara.run/public/boy?",
        bio: "New User",
      })
      .returning(); // returning the new user

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: newUser[0].id,
        username: newUser[0].username,
        email: newUser[0].email,
      },
    });
  } catch (error: any) {
    console.log("Error in registerUser controller", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<any> => {
  const { email, password } = req.body;
  try {
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found please register first" });
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }

    // if everything is valid send a success response

    res.status(200).json({
      id: user.id,
      username: user.username,
      email: user.email,
    });
  } catch (error: any) {
    console.log("Error in login controller", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
