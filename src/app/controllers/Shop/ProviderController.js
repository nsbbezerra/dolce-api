const knex = require("../../../database/pg");
const configs = require("../../../configs/configs");
const azure = require("azure-storage");

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
    } = req.body;
    const { blobName } = req.file;
    const url = `${configs.blobProvider}${blobName}`;
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
        thumbnail: url,
        blobName,
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
      const providers = await knex.select("*").from("providers");
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
    const { blobName } = req.file;
    const url = `${configs.blobProvider}${blobName}`;
    try {
      const azureBlobService = azure.createBlobService();
      const provider = await knex("providers")
        .select("id", "blobName")
        .where({ id: id })
        .first();
      await azureBlobService.deleteBlobIfExists(
        "providers",
        provider.blobName,
        async function (error, result, response) {
          if (!error) {
            if (result === true) {
              await knex("providers").where({ id: id }).update({
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
        message: "Ocorreu um erro ao editar o fornecedor",
        errorMessage,
      });
    }
  },
};
