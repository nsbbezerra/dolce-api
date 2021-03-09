const knex = require("../../../database/pg");
const configs = require("../../../configs/configs");
const azure = require("azure-storage");

module.exports = {
  async Store(req, res) {
    const {
      bank,
      mode,
      agency,
      account,
      variation,
      operation,
      amount,
    } = req.body;
    const { blobName } = req.file;
    const url = `${configs.blobBank}${blobName}`;

    try {
      await knex("bankAccount").insert({
        bank,
        mode,
        agency,
        account,
        variation,
        operation,
        amount,
        thumbnail: url,
        blobName,
      });
      return res
        .status(201)
        .json({ message: "Conta bancária cadastrada com sucesso" });
    } catch (error) {
      const errorMessage = error.message;
      return res.status(400).json({
        message: "Ocorreu um erro ao cadastrar a conta bancária",
        errorMessage,
      });
    }
  },

  async Show(req, res) {
    try {
      const banks = await knex.select("*").from("bankAccount");
      return res.status(200).json(banks);
    } catch (error) {
      const errorMessage = error.message;
      return res.status(400).json({
        message: "Ocorreu um erro ao listar as contas bancárias",
        errorMessage,
      });
    }
  },

  async Update(req, res) {
    const {
      bank,
      mode,
      agency,
      account,
      variation,
      operation,
      amount,
    } = req.body;
    const { id } = req.params;

    try {
      const banks = await knex("bankAccount")
        .where({ id: id })
        .update({ bank, mode, agency, account, variation, operation, amount })
        .returning("*");
      return res
        .status(201)
        .json({ message: "Conta bancária alterada com sucesso", banks });
    } catch (error) {
      const errorMessage = error.message;
      return res.status(400).json({
        message: "Ocorreu um erro ao editar a conta bancária",
        errorMessage,
      });
    }
  },

  async UpdateImage(req, res) {
    const { id } = req.params;
    const { blobName } = req.file;

    try {
      const url = `${configs.blobBank}${blobName}`;
      const azureBlobService = azure.createBlobService();
      const bank = await knex("bankAccount")
        .select("id", "blobName")
        .where({ id: id })
        .first();

      await azureBlobService.deleteBlobIfExists(
        "bank",
        bank.blobName,
        async function (error, result, response) {
          if (!error) {
            if (result === true) {
              await knex("bankAccount").where({ id: id }).update({
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
        message: "Ocorreu um erro ao alterar a imagem da conta bancária",
        errorMessage,
      });
    }
  },

  async Active(req, res) {
    const { id } = req.params;
    const { active } = req.body;

    try {
      const bank = await knex("bankAccount")
        .where({ id: id })
        .update({ active })
        .returning("*");
      return res
        .status(201)
        .json({ message: "Conta bancária alterada com sucesso", bank });
    } catch (error) {
      const errorMessage = error.message;
      return res.status(400).json({
        message: "Ocorreu um erro ao bloquear/ativar a conta bancária",
        errorMessage,
      });
    }
  },
};
