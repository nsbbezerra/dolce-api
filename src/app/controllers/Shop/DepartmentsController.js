const configs = require("../../../configs/configs");
const knex = require("../../../database/pg");
const azure = require("azure-storage");

module.exports = {
  async Store(req, res) {
    const { name, description } = req.body;
    const { blobName } = req.file;
    const url = `${configs.blobDepartments}${blobName}`;
    try {
      await knex("departments").insert({
        name,
        description,
        thumbnail: url,
        blobName,
      });
      return res
        .status(201)
        .json({ message: "Departamento cadastrado com sucesso" });
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
      const departments = await knex.select("*").table("departments");
      return res.status(201).json(departments);
    } catch (error) {
      const errorMessage = error.message;
      return res.status(400).json({
        message: "Ocorreu um erro ao buscar os departamentos",
        errorMessage,
      });
    }
  },

  async UpdateImage(req, res) {
    const { id } = req.params;
    const { blobName } = req.file;
    try {
      const url = `${configs.blobDepartments}${blobName}`;
      const azureBlobService = azure.createBlobService();
      const department = await knex("departments")
        .select("id", "blobName")
        .where({ id: id })
        .first();

      await azureBlobService.deleteBlobIfExists(
        "departments",
        department.blobName,
        async function (error, result, response) {
          if (!error) {
            if (result === true) {
              await knex("departments").where({ id: id }).update({
                thumbnail: url,
                blobName: blobName,
              });
              return res
                .status(201)
                .json({ message: "Imagem alterada com sucesso" });
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
        message: "Ocorreu um erro ao alterar a imagem",
        errorMessage,
      });
    }
  },
};
