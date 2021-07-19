const knex = require("../../../database/pg");
const path = require("path");
const fs = require("fs");

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
    const { name, discount } = req.body;

    try {
      const [info] = await knex("tags")
        .insert({ name, discount })
        .returning("*");
      return res
        .status(201)
        .json({ message: "Informação salva com sucesso", info });
    } catch (error) {
      const errorMessage = error.message;
      return res.status(400).json({
        message: "Ocorreu um erro ao salvar as informações",
        errorMessage,
      });
    }
  },

  async StoreBanner(req, res) {
    const { id } = req.params;
    const { filename } = req.file;

    try {
      await knex("tags").where("id", id).update({ banner: filename });

      return res.status(201).json({ message: "Banner salvo com sucesso" });
    } catch (error) {
      const errorMessage = error.message;
      return res.status(400).json({
        message: "Ocorreu um erro ao salvar as informações",
        errorMessage,
      });
    }
  },

  async FindActive(req, res) {
    try {
      const tags = await knex
        .select("*")
        .from("tags")
        .where({ active: true })
        .orderBy("name");
      return res.status(200).json(tags);
    } catch (error) {
      const errorMessage = error.message;
      return res.status(400).json({
        message: "Ocorreu um erro ao buscar as informações",
        errorMessage,
      });
    }
  },

  async Find(req, res) {
    try {
      const tags = await knex.select("*").from("tags").orderBy("created_at");
      return res.status(200).json(tags);
    } catch (error) {
      const errorMessage = error.message;
      return res.status(400).json({
        message: "Ocorreu um erro ao buscar as informações",
        errorMessage,
      });
    }
  },

  async UpdateInfo(req, res) {
    const { id } = req.params;
    const { active } = req.body;

    try {
      const tags = await knex("tags")
        .where({ id: id })
        .update({ active })
        .returning("*");
      return res
        .status(201)
        .json({ message: "Informações alteradas com sucesso", tags });
    } catch (error) {
      const errorMessage = error.message;
      return res.status(400).json({
        message: "Ocorreu um erro ao alterar as informações",
        errorMessage,
      });
    }
  },

  async UpdateBanner(req, res) {
    const { id } = req.params;
    const { filename } = req.file;

    try {
      const tag = await knex.select("*").from("tags").where({ id: id }).first();

      if (tag.banner) {
        const pathToImage = path.resolve(
          __dirname,
          "..",
          "..",
          "..",
          "..",
          "..",
          "uploads",
          "img",
          tag.banner
        );
        await RemoveImage(pathToImage);
      }

      const tags = await knex("tags")
        .where({ id: id })
        .update({ banner: filename })
        .returning("*");

      return res
        .status(201)
        .json({ message: "Banner alterado com sucesso", tags });
    } catch (error) {
      const errorMessage = error.message;
      return res.status(400).json({
        message: "Ocorreu um erro ao alterar as informações",
        errorMessage,
      });
    }
  },
};
