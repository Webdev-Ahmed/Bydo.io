import { prisma } from "@/libs/prisma";
import { createCategorySchema, updateCategorySchema } from "@todo/shared";
import type { Request, Response } from "express";
import { flattenError, ZodError } from "zod";

export const getCategories = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const { type } = req.query;

    const where: any = { userId };
    if (type) where.type = type;

    const categories = await prisma.category.findMany({
      where,
      orderBy: { name: "asc" },
    });

    return res.status(200).json({ categories });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const createCategory = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const data = createCategorySchema.parse(req.body);

    const category = await prisma.category.create({
      data: {
        ...data,
        userId,
      },
    });

    return res.status(201).json({ category, message: "Category created" });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ message: flattenError(error).fieldErrors });
    }
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const id = req.params.id as string;
    const data = updateCategorySchema.parse(req.body);

    const category = await prisma.category.findFirst({
      where: { id, userId },
    });

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    const updated = await prisma.category.update({
      where: { id },
      data,
    });

    return res
      .status(200)
      .json({ category: updated, message: "Category updated" });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ message: flattenError(error).fieldErrors });
    }
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const id = req.params.id as string;

    const category = await prisma.category.findFirst({
      where: { id, userId },
    });

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    await prisma.category.delete({ where: { id } });

    return res.status(200).json({ message: "Category deleted" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
