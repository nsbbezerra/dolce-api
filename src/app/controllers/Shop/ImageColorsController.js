const knex = require("../../../database/pg");
const config = require("../../../configs/configs");
const fs = require("fs");
const path = require("path");

async function RemoveImage(url) {
  fs.unlink(url, (err) => {
    if (err) console.log(err);
    else {
      console.log();
    }
  });
}

module.exports = {
  async Store(req, res) {
    const { product, color, name, hex } = req.body;
    const { filename } = req.file;
    try {
      await knex("colorsImages").insert({
        products_id: product,
        colors_id: color,
        name,
        hex,
        image: filename,
      });
      return res.status(201).json({ message: "Imagem cadastrada com suceso" });
    } catch (error) {
      const errorMessage = error.message;
      return res.status(400).json({
        message: "Ocorreu um erro ao efetuar o cadastro",
        errorMessage,
      });
    }
  },

  async Show(req, res) {
    try {
      const images = await knex.select("*").table("colorsImages");
      return res.status(201).json(images);
    } catch (error) {
      const errorMessage = error.message;
      return res.status(400).json({
        message: "Ocorreu um erro ao buscar as informações",
        errorMessage,
      });
    }
  },

  async Find(req, res) {
    const { color } = req.params;
    try {
      const sizes = await knex
        .select("*")
        .from("colorsImages")
        .where({ colors_id: color });
      return res.status(201).json(sizes);
    } catch (error) {
      const errorMessage = error.message;
      return res.status(400).json({
        message: "Ocorreu um erro ao buscar as informações",
        errorMessage,
      });
    }
  },

  async FindDependents(req, res) {
    const { product } = req.params;
    try {
      const colors = await knex("colors")
        .select("*")
        .where({ products_id: product });
      return res.status(201).json(colors);
    } catch (error) {
      const errorMessage = error.message;
      return res.status(400).json({
        message: "Ocorreu um erro ao editar as informações",
        errorMessage,
      });
    }
  },

  async Remove(req, res) {
    const { id } = req.params;
    try {
      const img = await knex("colorsImages")
        .select("id", "image")
        .where({ id: id })
        .first();
      const pathToImage = path.resolve(
        __dirname,
        "..",
        "..",
        "..",
        "..",
        "..",
        "uploads",
        "img",
        img.image
      );
      await RemoveImage(pathToImage);
      await knex("colorsImages").where({ id: id }).del();
      return res.status(201).json({ message: "Imagem excluída com sucesso" });
    } catch (error) {
      const errorMessage = error.message;
      return res.status(400).json({
        message: "Ocorreu um erro ao excluir as informações",
        errorMessage,
      });
    }
  },
};
