import { NextFunction, Request, Response } from "express";
import { Ad } from "../entities/Ad";
import { FindOperator, Like } from "typeorm";

export const getAll = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const categoryId = req.query.category;
  const search = req.query.search;
  const whereOptions: {
    category?: { id: number };
    title?: FindOperator<string>;
  } = {};

  if (categoryId && categoryId !== "null") {
    whereOptions.category = { id: parseInt(categoryId as string) };
  }
  if (search && search !== "null") {
    whereOptions.title = Like(`%${search}%`);
  }
  try {
    const ads = await Ad.find({
      where: whereOptions,
      relations: {
        category: true,
        tags: true,
      },
    });
    res.send(ads);
  } catch (err) {
    next(err);
  }
};

export const getOne = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const ad = await Ad.findOne({
      where: { id: parseInt(req.params.id) },
      relations: {
        category: true,
        tags: true,
      },
    });
    if (!ad) {
      res.status(404).send("Ad not found");
      return;
    }
    res.send(ad);
  } catch (err) {
    next(err);
  }
};

export const create = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const ad = new Ad();
  ad.title = req.body.title;
  ad.description = req.body.description;
  ad.author = req.body.author;
  ad.price = req.body.price;
  ad.pictureUrl = req.body.pictureUrl;
  ad.city = req.body.city;
  ad.category = req.body.category;
  ad.tags = req.body.tags;

  try {
    await ad.save();
    res.status(201).send("Ad created with success");
  } catch (err) {
    next(err);
  }
};

export const update = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const ad = await Ad.findOneBy({ id: parseInt(req.params.id) });
    if (!ad) {
      res.status(404).send("Ad not found");
      return;
    }

    if (req.body.title) ad.title = req.body.title;
    if (req.body.description) ad.description = req.body.description;
    if (req.body.author) ad.author = req.body.author;
    if (req.body.price) ad.price = req.body.price;
    if (req.body.pictureUrl) ad.pictureUrl = req.body.pictureUrl;
    if (req.body.city) ad.city = req.body.city;
    if (req.body.category) ad.category = req.body.category;
    if (req.body.tags) ad.tags = req.body.tags;

    await ad.save();
    res.status(204).send("Ad updated with success");
  } catch (err) {
    next(err);
  }
};

export const remove = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const ad = await Ad.findOneBy({ id: parseInt(req.params.id) });
    if (!ad) {
      res.status(404).send("Ad not found");
      return;
    }

    await ad.remove();
    res.send("Deleted with success");
  } catch (err) {
    next(err);
  }
};
