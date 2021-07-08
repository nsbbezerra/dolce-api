const knex = require("../../../database/pg");
const fs = require("fs");
const path = require("path");
const uniqid = require("uniqid");

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
      provider,
      information,
      list,
    } = req.body;
    const { filename } = req.file;
    try {
      await knex("products").insert({
        departments_id,
        categories_id,
        name,
        identify: uniqid("produto-"),
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
        thumbnail: filename,
        providers_id: provider,
        information,
        list: list,
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
    const { page, find, name } = req.params;
    const pageInt = parseInt(page);
    try {
      if (find === "1") {
        const products = await knex
          .select([
            "products.id",
            "products.name",
            "products.thumbnail",
            "products.description",
            "products.sku",
            "products.barcode",
            "products.cfop",
            "products.ncm",
            "products.icms_rate",
            "products.icms_origin",
            "products.icms_csosn",
            "products.icms_st_rate",
            "products.icms_marg_val_agregate",
            "products.icms_st_mod_bc",
            "products.fcp_rate",
            "products.fcp_st_rate",
            "products.fcp_ret_rate",
            "products.ipi_cst",
            "products.ipi_rate",
            "products.ipi_code",
            "products.pis_cst",
            "products.pis_rate",
            "products.cofins_cst",
            "products.cofins_rate",
            "products.cest",
            "products.cost_value",
            "products.other_cost",
            "products.sale_value",
            "products.freight_weight",
            "products.freight_width",
            "products.freight_height",
            "products.freight_diameter",
            "products.freight_length",
            "products.rating",
            "products.promotional",
            "products.promotional_value",
            "products.promotional_rate",
            "products.active",
            "products.information",
            "products.list",
            "departments.name as dep_name",
            "categories.name as cat_name",
            "departments.id as dep_id",
            "categories.id as cat_id",
          ])
          .from("products")
          .where("products.active", true)
          .innerJoin("departments", "departments.id", "products.departments_id")
          .innerJoin("categories", "categories.id", "products.categories_id")
          .orderBy("name")
          .limit(10)
          .offset((pageInt - 1) * 10);

        const [count] = await knex("products")
          .where("products.active", true)
          .count();

        return res.status(201).json({ products, count });
      }
      if (find === "2") {
        const products = await knex
          .select([
            "products.id",
            "products.name",
            "products.thumbnail",
            "products.description",
            "products.sku",
            "products.barcode",
            "products.cfop",
            "products.ncm",
            "products.icms_rate",
            "products.icms_origin",
            "products.icms_csosn",
            "products.icms_st_rate",
            "products.icms_marg_val_agregate",
            "products.icms_st_mod_bc",
            "products.fcp_rate",
            "products.fcp_st_rate",
            "products.fcp_ret_rate",
            "products.ipi_cst",
            "products.ipi_rate",
            "products.ipi_code",
            "products.pis_cst",
            "products.pis_rate",
            "products.cofins_cst",
            "products.cofins_rate",
            "products.cest",
            "products.cost_value",
            "products.other_cost",
            "products.sale_value",
            "products.freight_weight",
            "products.freight_width",
            "products.freight_height",
            "products.freight_diameter",
            "products.freight_length",
            "products.rating",
            "products.promotional",
            "products.promotional_value",
            "products.promotional_rate",
            "products.active",
            "products.information",
            "products.list",
            "departments.name as dep_name",
            "categories.name as cat_name",
            "departments.id as dep_id",
            "categories.id as cat_id",
          ])
          .from("products")
          .where("products.active", false)
          .innerJoin("departments", "departments.id", "products.departments_id")
          .innerJoin("categories", "categories.id", "products.categories_id")
          .orderBy("name")
          .limit(10)
          .offset((pageInt - 1) * 10);

        const [count] = await knex("products")
          .where("products.active", false)
          .count();

        return res.status(201).json({ products, count });
      }
      if (find === "3") {
        const products = await knex
          .select([
            "products.id",
            "products.name",
            "products.thumbnail",
            "products.description",
            "products.sku",
            "products.barcode",
            "products.cfop",
            "products.ncm",
            "products.icms_rate",
            "products.icms_origin",
            "products.icms_csosn",
            "products.icms_st_rate",
            "products.icms_marg_val_agregate",
            "products.icms_st_mod_bc",
            "products.fcp_rate",
            "products.fcp_st_rate",
            "products.fcp_ret_rate",
            "products.ipi_cst",
            "products.ipi_rate",
            "products.ipi_code",
            "products.pis_cst",
            "products.pis_rate",
            "products.cofins_cst",
            "products.cofins_rate",
            "products.cest",
            "products.cost_value",
            "products.other_cost",
            "products.sale_value",
            "products.freight_weight",
            "products.freight_width",
            "products.freight_height",
            "products.freight_diameter",
            "products.freight_length",
            "products.rating",
            "products.promotional",
            "products.promotional_value",
            "products.promotional_rate",
            "products.active",
            "products.information",
            "products.list",
            "departments.name as dep_name",
            "categories.name as cat_name",
            "departments.id as dep_id",
            "categories.id as cat_id",
          ])
          .from("products")
          .where("promotional", true)
          .innerJoin("departments", "departments.id", "products.departments_id")
          .innerJoin("categories", "categories.id", "products.categories_id")
          .orderBy("name")
          .limit(10)
          .offset((pageInt - 1) * 10);

        const [count] = await knex("products")
          .where("promotional", true)
          .count();

        return res.status(201).json({ products, count });
      }
      if (find === "4") {
        const products = await knex
          .select([
            "products.id",
            "products.name",
            "products.thumbnail",
            "products.description",
            "products.sku",
            "products.barcode",
            "products.cfop",
            "products.ncm",
            "products.icms_rate",
            "products.icms_origin",
            "products.icms_csosn",
            "products.icms_st_rate",
            "products.icms_marg_val_agregate",
            "products.icms_st_mod_bc",
            "products.fcp_rate",
            "products.fcp_st_rate",
            "products.fcp_ret_rate",
            "products.ipi_cst",
            "products.ipi_rate",
            "products.ipi_code",
            "products.pis_cst",
            "products.pis_rate",
            "products.cofins_cst",
            "products.cofins_rate",
            "products.cest",
            "products.cost_value",
            "products.other_cost",
            "products.sale_value",
            "products.freight_weight",
            "products.freight_width",
            "products.freight_height",
            "products.freight_diameter",
            "products.freight_length",
            "products.rating",
            "products.promotional",
            "products.promotional_value",
            "products.promotional_rate",
            "products.active",
            "products.information",
            "products.list",
            "departments.name as dep_name",
            "categories.name as cat_name",
            "departments.id as dep_id",
            "categories.id as cat_id",
          ])
          .from("products")
          .innerJoin("departments", "departments.id", "products.departments_id")
          .innerJoin("categories", "categories.id", "products.categories_id")
          .orderBy("name")
          .limit(10)
          .offset((pageInt - 1) * 10);

        const [count] = await knex("products").count();

        return res.status(201).json({ products, count });
      }
      if (find === "5") {
        const products = await knex
          .select([
            "products.id",
            "products.name",
            "products.thumbnail",
            "products.description",
            "products.sku",
            "products.barcode",
            "products.cfop",
            "products.ncm",
            "products.icms_rate",
            "products.icms_origin",
            "products.icms_csosn",
            "products.icms_st_rate",
            "products.icms_marg_val_agregate",
            "products.icms_st_mod_bc",
            "products.fcp_rate",
            "products.fcp_st_rate",
            "products.fcp_ret_rate",
            "products.ipi_cst",
            "products.ipi_rate",
            "products.ipi_code",
            "products.pis_cst",
            "products.pis_rate",
            "products.cofins_cst",
            "products.cofins_rate",
            "products.cest",
            "products.cost_value",
            "products.other_cost",
            "products.sale_value",
            "products.freight_weight",
            "products.freight_width",
            "products.freight_height",
            "products.freight_diameter",
            "products.freight_length",
            "products.rating",
            "products.promotional",
            "products.promotional_value",
            "products.promotional_rate",
            "products.active",
            "products.information",
            "products.list",
            "departments.name as dep_name",
            "categories.name as cat_name",
            "departments.id as dep_id",
            "categories.id as cat_id",
          ])
          .from("products")
          .where("products.name", "like", `%${name}%`)
          .innerJoin("departments", "departments.id", "products.departments_id")
          .innerJoin("categories", "categories.id", "products.categories_id")
          .orderBy("name")
          .limit(10)
          .offset((pageInt - 1) * 10);

        const [count] = await knex("products")
          .where("products.name", "like", `%${name}%`)
          .count();

        return res.status(201).json({ products, count });
      }
    } catch (error) {
      console.log(error);
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
      const providers = await knex.select("*").table("providers");
      return res.status(201).json({ departments, categories, providers });
    } catch (error) {
      const errorMessage = error.message;
      return res.status(400).json({
        message: "Ocorreu um erro ao buscar as informações",
        errorMessage,
      });
    }
  },

  async UpdateImage(req, res) {
    const { id } = req.params;
    const { filename } = req.file;
    try {
      const findProduct = await knex("products").where({ id: id }).first();
      const pathToImage = path.resolve(
        __dirname,
        "..",
        "..",
        "..",
        "..",
        "..",
        "uploads",
        "img",
        findProduct.thumbnail
      );
      await RemoveImage(pathToImage);
      const product = await knex("products")
        .where({ id: id })
        .update({ thumbnail: filename })
        .returning("*");
      return res.status(201).json(product);
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
    const {
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
    } = req.body;

    try {
      const product = await knex("products")
        .where({ id: id })
        .update({
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
        })
        .returning("*");
      return res
        .status(201)
        .json({ message: "Alteração concluída com sucesso", product });
    } catch (error) {
      const errorMessage = error.message;
      return res.status(400).json({
        message: "Ocorreu um erro ao alterar as informações",
        errorMessage,
      });
    }
  },

  async FindProducts(req, res) {
    try {
      const products = await knex
        .select([
          "products.id",
          "products.name",
          "products.thumbnail",
          "products.description",
          "products.sku",
          "products.barcode",
          "products.cfop",
          "products.ncm",
          "products.icms_rate",
          "products.icms_origin",
          "products.icms_csosn",
          "products.icms_st_rate",
          "products.icms_marg_val_agregate",
          "products.icms_st_mod_bc",
          "products.fcp_rate",
          "products.fcp_st_rate",
          "products.fcp_ret_rate",
          "products.ipi_cst",
          "products.ipi_rate",
          "products.ipi_code",
          "products.pis_cst",
          "products.pis_rate",
          "products.cofins_cst",
          "products.cofins_rate",
          "products.cest",
          "products.cost_value",
          "products.other_cost",
          "products.sale_value",
          "products.freight_weight",
          "products.freight_width",
          "products.freight_height",
          "products.freight_diameter",
          "products.freight_length",
          "products.rating",
          "products.promotional",
          "products.promotional_value",
          "products.promotional_rate",
          "products.active",
          "products.information",
          "products.list",
          "departments.name as dep_name",
          "categories.name as cat_name",
          "departments.id as dep_id",
          "categories.id as cat_id",
        ])
        .from("products")
        .innerJoin("departments", "departments.id", "products.departments_id")
        .innerJoin("categories", "categories.id", "products.categories_id")
        .orderBy("name");

      return res.status(200).json(products);
    } catch (error) {
      const errorMessage = error.message;
      return res.status(400).json({
        message: "Ocorreu um erro ao buscar as informações",
        errorMessage,
      });
    }
  },

  async SetPromotional(req, res) {
    const { id } = req.params;
    const { promotional, promotional_value, promotional_rate } = req.body;
    try {
      const product = await knex("products")
        .where({ id: id })
        .update({ promotional, promotional_value, promotional_rate })
        .returning("*");
      return res
        .status(201)
        .json({ message: "Alteração concluída com sucesso", product });
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
      const product = await knex("products")
        .where({ id: id })
        .update({ active })
        .returning("*");
      return res
        .status(201)
        .json({ message: "Alteração concluída com sucesso", product });
    } catch (error) {
      const errorMessage = error.message;
      return res.status(400).json({
        message: "Ocorreu um erro ao alterar as informações",
        errorMessage,
      });
    }
  },

  async UpdateStock(req, res) {
    const { id } = req.params;
    const { amount } = req.body;

    try {
      const size = await knex("sizes")
        .where({ products_id: id })
        .update({ amount })
        .returning("*");
      return res
        .status(201)
        .json({ message: "Alteração concluída com sucesso", size });
    } catch (error) {
      const errorMessage = error.message;
      return res.status(400).json({
        message: "Ocorreu um erro ao alterar as informações",
        errorMessage,
      });
    }
  },

  async UpdateInfoAndList(req, res) {
    const { id } = req.params;
    const { information, list } = req.body;

    try {
      const product = await knex("products")
        .where({ id: id })
        .update({ information, list })
        .returning("*");

      return res
        .status(201)
        .json({ message: "Informações alteradas com sucesso", product });
    } catch (error) {
      const errorMessage = error.message;
      return res.status(400).json({
        message: "Ocorreu um erro ao alterar as informações",
        errorMessage,
      });
    }
  },
};
