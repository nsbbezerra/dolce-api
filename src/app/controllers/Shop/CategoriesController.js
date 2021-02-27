const configs = require("../../../configs/configs");
const knex = require("../../../database/pg");
const azure = require("azure-storage");

module.exports = {
  async Store(req, res) {
    const { name, description, department } = req.body;
    const { blobName } = req.file;
    const url = `${configs.blobCategory}${blobName}`;
    try {
      await knex("categories").insert({
        name,
        departments_id: department,
        description,
        thumbnail: url,
        blobName,
      });
      return res.status(201).json({ message: "Cadastro efetuado com sucesso" });
    } catch (error) {
      const errorMessage = error.message;
      return res.status(400).json({
        message: "Ocorreu um erro ao cadastrar o departamento",
        errorMessage,
      });
    }
  },

  async Show(req, res) {
    try {
      const categories = await knex
        .select([
          "categories.id",
          "categories.name",
          "categories.thumbnail",
          "categories.blobName",
          "categories.description",
          "categories.active",
          "departments.name as dep_name",
        ])
        .from("categories")
        .innerJoin(
          "departments",
          "departments.id",
          "categories.departments_id"
        );

      return res.status(201).json(categories);
    } catch (error) {
      const errorMessage = error.message;
      return res.status(400).json({
        message: "Ocorreu um erro ao cadastrar o departamento",
        errorMessage,
      });
    }
  },

  async UpdateImage(req, res) {
    const { id } = req.params;
    const { blobName } = req.file;

    try {
      const url = `${configs.blobCategory}${blobName}`;
      const azureBlobService = azure.createBlobService();
      const category = await knex("categories")
        .select("id", "blobName")
        .where({ id: id })
        .first();

      await azureBlobService.deleteBlobIfExists(
        "categories",
        category.blobName,
        async function (error, result, response) {
          if (!error) {
            if (result === true) {
              await knex("categories").where({ id: id }).update({
                thumbnail: url,
                blobName: blobName,
              });
              return res.status(201).json({
                message: "Imagem alterada com sucesso",
                url,
                blobName,
              });
            } else {
              const errorMessage = "Blob service not response";
              return res.status(400).json({
                message: "Ocorreu um erro ao substituir a imagem",
                errorMessage,
              });
            }
          } else {
            const errorMessage = error.message;
            return res.status(400).json({
              message: "Ocorreu um erro ao substituir a imagem",
              errorMessage,
            });
          }
        }
      );
    } catch (error) {
      const errorMessage = error.message;
      return res.status(400).json({
        message: "Ocorreu um erro ao substituir a imagem",
        errorMessage,
      });
    }
  },

  async Update(req, res) {
    const { id } = req.params;
    const { name, description } = req.body;

    try {
      const category = await knex("categories")
        .where({ id: id })
        .update({ name, description })
        .returning("*");
      return res
        .status(201)
        .json({ message: "Informações alteradas com sucesso", category });
    } catch (error) {
      const errorMessage = error.message;
      return res.status(400).json({
        message: "Ocorreu um erro ao alterar as informações",
        errorMessage,
      });
    }
  },

  async Active(req, res) {
    const { id } = req.params;
    const { active } = req.body;

    try {
      const category = await knex("categories")
        .where({ id: id })
        .update({ active })
        .returning("*");
      return res
        .status(201)
        .json({ message: "Informações alteradas com sucesso", category });
    } catch (error) {
      const errorMessage = error.message;
      return res.status(400).json({
        message: "Ocorreu um erro ao alterar as informações",
        errorMessage,
      });
    }
  },
};
