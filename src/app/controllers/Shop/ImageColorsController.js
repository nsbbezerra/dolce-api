const knex = require("../../../database/pg");

module.exports = {
  async Store(req, res) {
    const { product, color, name, hex } = req.body;
    const { url } = req.file;
    try {
      await knex("colorsImages").insert({
        products_id: product,
        colors_id: color,
        name,
        hex,
        image: url,
      });
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
};
