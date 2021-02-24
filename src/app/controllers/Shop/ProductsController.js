const configs = require("../../../configs/configs");
const knex = require("../../../database/pg");

module.exports = {
  async Store(req, res) {
    const {
      departments_id,
      categories_id,
      name,
      description,
      sku,
      barcode,
      cfop,
      ncm,
      icms_rate,
      icms_origin,
      icms_csosn,
      icms_st_rate,
      icms_marg_val_agregate,
      icms_st_mod_bc,
      fcp_rate,
      fcp_st_rate,
      fcp_ret_rate,
      ipi_cst,
      ipi_rate,
      ipi_code,
      pis_cst,
      pis_rate,
      cofins_cst,
      cofins_rate,
      cest,
      cost_value,
      other_cost,
      sale_value,
      code_freight,
      freight_weight,
      freight_width,
      freight_height,
      freight_diameter,
      freight_length,
      freight_format,
    } = req.body;
    const { blobName } = req.file;
    const url = `${configs.blobProducts}${blobName}`;
    try {
      await knex("products").insert({
        departments_id,
        categories_id,
        name,
        description,
        sku,
        barcode,
        cfop,
        ncm,
        icms_rate,
        icms_origin,
        icms_csosn,
        icms_st_rate,
        icms_marg_val_agregate,
        icms_st_mod_bc,
        fcp_rate,
        fcp_st_rate,
        fcp_ret_rate,
        ipi_cst,
        ipi_rate,
        ipi_code,
        pis_cst,
        pis_rate,
        cofins_cst,
        cofins_rate,
        cest,
        cost_value,
        other_cost,
        sale_value,
        code_freight,
        freight_weight,
        freight_width,
        freight_height,
        freight_diameter,
        freight_length,
        freight_format,
        thumbnail: url,
      });
      return res
        .status(201)
        .json({ message: "Produto cadastrado com sucesso" });
    } catch (error) {
      const errorMessage = error.message;
      return res.status(400).json({
        message: "Ocorreu um erro ao cadastrar o produto",
        errorMessage,
      });
    }
  },

  async Show(req, res) {
    try {
      const products = await knex.select("*").table("products");
      return res.status(201).json(products);
    } catch (error) {
      const errorMessage = error.message;
      return res.status(400).json({
        message: "Ocorreu um erro ao buscar os produtos",
        errorMessage,
      });
    }
  },

  async FindAllDependets(req, res) {
    try {
      const departments = await knex.select("*").table("departments");
      const categories = await knex.select("*").table("categories");
      return res.status(201).json({ departments, categories });
    } catch (error) {
      const errorMessage = error.message;
      return res.status(400).json({
        message: "Ocorreu um erro ao buscar as informações",
        errorMessage,
      });
    }
  },
};
