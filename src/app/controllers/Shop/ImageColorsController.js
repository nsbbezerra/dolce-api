const knex = require("../../../database/pg");
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
    const { product } = req.body;
    const { filename } = req.file;
    try {
      await knex("images").insert({
        products_id: product,
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
      const images = await knex.select("*").table("images");
      return res.status(201).json(images);
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
      const img = await knex("images")
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
      await knex("images").where({ id: id }).del();
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
