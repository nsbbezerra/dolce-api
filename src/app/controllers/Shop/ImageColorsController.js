const knex = require("../../../database/pg");
const config = require("../../../configs/configs");
const azure = require("azure-storage");

module.exports = {
  async Store(req, res) {
    const { product, color, name, hex } = req.body;
    const { blobName } = req.file;
    const url = `${config.blobColors}${blobName}`;
    try {
      await knex("colorsImages").insert({
        products_id: product,
        colors_id: color,
        name,
        hex,
        image: url,
        blobName,
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
        .from("colors")
        .join("colorsImages", function () {
          this.on("colors.id", "=", "colorsImages.colors_id").onIn(
            "colorsImages.products_id",
            color
          );
        })
        .orderBy("colors_id");
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
      const azureBlobService = azure.createBlobService();
      const img = await knex("colorsImages")
        .select("id", "blobName")
        .where({ id: id })
        .first();

      await azureBlobService.deleteBlobIfExists(
        "colors",
        img.blobName,
        async function (error, result, response) {
          if (!error) {
            if (result === true) {
              await knex("colorsImages").where({ id: id }).del();
              return res
                .status(201)
                .json({ message: "Imagem removida com sucesso" });
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
              message: "Ocorreu um erro ao remover a imagem",
              errorMessage,
            });
          }
        }
      );
    } catch (error) {
      const errorMessage = error.message;
      return res.status(400).json({
        message: "Ocorreu um erro ao excluir as informações",
        errorMessage,
      });
    }
  },
};
