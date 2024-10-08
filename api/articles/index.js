const express = require("express");
const { HttpError } = require("../../middlewares/error.js");
const Article = require("../../models/Article.js");
const multer = require("../../middlewares/multer-config.js");
const optimizeImage = require("../../middlewares/multer-sharp.js");
const auth = require("../../middlewares/auth.js");
const { uploadFileImages } = require("../../managers/s3.js");

let route = express.Router({ mergeParams: true });

route.get("/all", async (req, res) => {
  const articles = await Article.find().sort({ createdAt: -1 });

  if (!articles) {
    throw new HttpError(404, {
      message: "Erreur dans la récupération des articles",
    });
  }

  res.status(200).json(articles);
});

route.get("/latest", async (req, res) => {
  const articles = await Article.find()
    .sort({ createdAt: -1 })
    .limit(6)
    .catch(() => {
      throw new HttpError(401, {
        message: "Erreur dans la récuperation des articles",
      });
    });
  res.status(200).json(articles);
});

route.get("/casques", async (req, res) => {
  const query = { tag: "casques" };
  const articles = await Article.find(query).sort({
    createdAt: -1,
  });

  if (!articles) {
    throw new HttpError(404, {
      message: "Erreur dans la récupération des articles",
    });
  }

  res.status(200).json(articles);
});

route.get("/chaussures", async (req, res) => {
  const query = { tag: "chaussures" };
  const articles = await Article.find(query).sort({
    createdAt: -1,
  });

  if (!articles) {
    throw new HttpError(404, {
      message: "Erreur dans la récupération des articles",
    });
  }

  res.status(200).json(articles);
});

route.get("/lunettes", async (req, res) => {
  const query = { tag: "lunettes" };
  const articles = await Article.find(query).sort({
    createdAt: -1,
  });

  if (!articles) {
    throw new HttpError(404, {
      message: "Erreur dans la récupération des articles",
    });
  }

  res.status(200).json(articles);
});

route.get("/vetements", async (req, res) => {
  const query = { tag: "vetements" };
  const articles = await Article.find(query).sort({
    createdAt: -1,
  });

  if (!articles) {
    throw new HttpError(404, {
      message: "Erreur dans la récupération des articles",
    });
  }

  res.status(200).json(articles);
});

route.get("/perPage", async (req, res) => {
  const page = req.query.page || 1; // Récupérez le numéro de la page depuis la requête (par défaut à la page 1)
  const perPage = req.query.perPage || 20; // Récupérez le nombre d'articles par page depuis la requête (par défaut à 20)

  const skip = (page - 1) * perPage; // Calculez combien d'articles à sauter en fonction de la page
  const articles = await Article.find()
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(perPage);

  if (!articles) {
    throw new HttpError(404, {
      message: "Erreur dans la récupération des articles",
    });
  }

  res.status(200).json(articles);
});

route.post("/", auth, multer, optimizeImage, async (req, res) => {
  const articleObject = req.body;
  const file = req.file;
  const result = await uploadFileImages(
    file.buffer,
    file.filename,
    file.mimetype
  );
  console.log(result);
  const fileUrl = result.Location;

  const description = req.body.description;
  const article = new Article({
    ...articleObject,
    file: fileUrl,
  });

  await article.save().catch(() => {
    throw new HttpError(400, { message: "Article non enregistré !" });
  });
  res.status(201).json({ message: "Article enregistré !" });
});

module.exports = route;
