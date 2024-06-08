import { Request, Response } from "express";
import bcrypt from "bcrypt";
import User, { IUser } from "../models/userModel";
import {
  generateToken,
  generateRefreshToken,
  verifyRefreshToken,
  verifyToken,
} from "../utils/jwt";
import { sendResetPasswordEmail } from "../utils/send-email";

const SALT_ROUNDS = 10;

export const signupUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, email, password, role, profile_image } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "Email already exists" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const user: IUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
      profile_image: profile_image || "",
    });
    await user.save();

    // Omit password property
    const userObj = user.toObject();
    delete userObj.password;

    console.log(`User Signed Up: ${userObj}`);
    res
      .status(201)
      .json({ message: "User signed up successfully", user: userObj });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Server error occurred";
    res.status(400).json({ message });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ message: "The email is not registered" });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ message: "Incorrect Password" });
      return;
    }

    const token = generateToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    res
      .status(200)
      .json({ message: "Login successful", token, refreshToken, user });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Server error occurred";
    res.status(500).json({ message });
  }
};

export const refreshToken = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { refreshToken } = req.body;
    const payload = verifyRefreshToken(refreshToken);
    const newToken = generateToken(payload.userId);

    res.status(200).json({ token: newToken });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Invalid refresh token";
    res.status(401).json({ message });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ message: "The email is not registered" });
  }

  const token = generateToken(user.id);

  await sendResetPasswordEmail(email, token);
  console.log(`Email sent to ${email}`);
  res.status(200).json({ message: "Password reset email sent" });
};

export const resetPassword = async (req: Request, res: Response) => {
  const { token, newPassword } = req.body;
  let decodedToken;

  try {
    decodedToken = verifyToken(token);
  } catch (err) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }

  const user = await User.findById(decodedToken?.userId);

  if (!user) {
    return res.status(400).json({ message: "Invalid or expired Token" });
  }

  const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
  user.password = hashedPassword;

  const userIns: IUser = new User(user);
  await userIns.save();
  console.log("Password Reset Successful");
  res.status(200).json({ message: "Password reset successful" });
};
