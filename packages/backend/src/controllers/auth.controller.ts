import { prisma } from "@/libs/prisma";
import { loginSchema, registerSchema } from "@todo/shared";
import type { Request, Response } from "express";
import { ZodError, flattenError } from "zod";
import { comparePassword, hashPassword } from "@/libs/utils";
import jwt from "jsonwebtoken";
import env from "@/libs/env";
import { clearCookie, getCookie, setCookie } from "@/libs/cookies";

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = registerSchema.parse(req.body);
    const hashed = await hashPassword(password);

    const user = await prisma.user.findFirst({ where: { email } });
    if (user) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const newUser = await prisma.user.create({
      data: { name, email, password: hashed },
    });
    if (!newUser) {
      return res.status(400).json({ message: "Failed to create user" });
    }

    const token = jwt.sign({ userId: newUser.id }, env.JWT_SECRET, {
      expiresIn: "7d",
    });

    setCookie(res, "access_token", token);

    return res
      .status(201)
      .json({ user: newUser, token, message: "User created successfully" });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ message: flattenError(error).fieldErrors });
    }
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const validPw = await comparePassword(password, user.password);
    if (!validPw) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ userId: user.id }, env.JWT_SECRET, {
      expiresIn: "7d",
    });

    setCookie(res, "access_token", token);

    return res.status(200).json({ user, token, message: "Logged in successfully" });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ message: flattenError(error).fieldErrors });
    }
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const logout = (_req: Request, res: Response) => {
  clearCookie(res, "access_token");

  return res.status(200).json({
    message: "Logged out successfully",
  });
};

export const getMe = async (req: Request, res: Response) => {
  try {
    const token = getCookie(req, "access_token");

    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const decoded = jwt.verify(token, env.JWT_SECRET) as { userId: string };

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ user, token });
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: "Invalid token" });
    }
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: "Token expired" });
    }
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
