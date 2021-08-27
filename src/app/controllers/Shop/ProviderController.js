const knex = require("../../../database/pg");
const config = require("../../../configs/configs");
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
    const {
      name,
      cnpj,
      contact,
      email,
      street,
      number,
      comp,
      district,
      city,
      cep,
      state,
      fantasia,
    } = req.body;
    const { filename } = req.file;
    try {
      await knex("providers").insert({
        name,
        cnpj,
        contact,
        email,
        street,
        number,
        comp,
        district,
        city,
        cep,
        state,
        fantasia,
        thumbnail: filename,
      });
      return res
        .status(201)
        .json({ message: "Fornecedor cadastrado com sucesso" });
    } catch (error) {
      const errorMessage = error.message;
      return res.status(400).json({
        message: "Ocorreu um erro ao cadastrar o fornecedor",
        errorMessage,
      });
    }
  },

  async Show(req, res) {
    try {
      const providers = await knex
        .select("*")
        .from("providers")
        .orderBy("name");
      return res.status(201).json(providers);
    } catch (error) {
      const errorMessage = error.message;
      return res.status(400).json({
        message: "Ocorreu um erro ao buscar os fornecedores",
        errorMessage,
      });
    }
  },

  async Update(req, res) {
    const { id } = req.params;
    const {
      name,
      cnpj,
      contact,
      email,
      street,
      number,
      comp,
      district,
      city,
      cep,
      state,
      fantasia,
    } = req.body;

    try {
      await knex("providers").where({ id: id }).update({
        name,
        cnpj,
        contact,
        email,
        street,
        number,
        comp,
        district,
        city,
        cep,
        state,
        fantasia,
      });
      return res
        .status(201)
        .json({ message: "Alteração concluída com sucesso" });
    } catch (error) {
      const errorMessage = error.message;
      return res.status(400).json({
        message: "Ocorreu um erro ao editar o fornecedor",
        errorMessage,
      });
    }
  },

  async Active(req, res) {
    const { id } = req.params;
    const { active } = req.body;

    try {
      await knex("providers").where({ id: id }).update({ active });
      return res
        .status(201)
        .json({ message: "Alteração concluída com sucesso" });
    } catch (error) {
      const errorMessage = error.message;
      return res.status(400).json({
        message: "Ocorreu um erro ao editar o fornecedor",
        errorMessage,
      });
    }
  },

  async UpdateImage(req, res) {
    const { id } = req.params;
    const { filename } = req.file;

    try {
      const imgUrl = config.urlImage;
      const provider = await knex("providers")
        .select("id", "thumbnail")
        .where({ id: id })
        .first();
      if (provider.thumbnail) {
        const pathToImage = path.resolve(
          __dirname,
          "..",
          "..",
          "..",
          "..",
          "..",
          "uploads",
          "img",
          provider.thumbnail
        );
        await RemoveImage(pathToImage);
      }
      const newProvider = await knex("providers")
        .where({ id: id })
        .update({ thumbnail: filename })
        .returning("*");
      return res
        .status(201)
        .json({ imgUrl, newProvider, message: "Imagem alterada com sucesso" });
    } catch (error) {
      const errorMessage = error.message;
      return res.status(400).json({
        message: "Ocorreu um erro ao editar o fornecedor",
        errorMessage,
      });
    }
  },
};
