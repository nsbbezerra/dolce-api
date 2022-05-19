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

const products_config = [
  "products.id",
  "products.name",
  "products.thumbnail",
  "products.description",
  "products.sku",
  "products.provider_code",
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
  "products.icms_base_calc",
  "products.imcs_st_base_calc",
  "products.fcp_base_calc",
  "products.fcp_st_base_calc",
  "products.pis_base_calc",
  "products.cofins_base_calc",
  "products.cest",
  "products.cost_value",
  "products.other_cost",
  "products.sale_value",
  "products.freight_weight",
  "products.freight_width",
  "products.freight_height",
  "products.freight_diameter",
  "products.freight_length",
  "products.freight_format",
  "products.rating",
  "products.promotional",
  "products.promotional_value",
  "products.promotional_rate",
  "products.active",
  "products.information",
  "products.list",
];

module.exports = {
  async Store(req, res) {
    const {
      name,
      description,
      sku,
      provider_code,
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
      provider,
      handle,
      id_to_del,
      icms_base_calc,
      imcs_st_base_calc,
      fcp_base_calc,
      fcp_st_base_calc,
      pis_base_calc,
      cofins_base_calc,
      stock,
    } = req.body;

    try {
      await knex("products").insert({
        name,
        identify: uniqid(),
        description,
        sku,
        provider_code,
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
        providers_id: provider,
        icms_base_calc,
        imcs_st_base_calc,
        fcp_base_calc,
        fcp_st_base_calc,
        pis_base_calc,
        cofins_base_calc,
        stock,
      });
      if (handle === "on") {
        await knex("tempProducts").where({ id: id_to_del }).del();
      }
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
          .select(products_config)
          .from("products")
          .where("active", true)
          .orderBy("name")
          .limit(10)
          .offset((pageInt - 1) * 10);

        const [count] = await knex("products").where("active", true).count();

        return res.status(201).json({ products, count });
      }
      if (find === "2") {
        const products = await knex
          .select(products_config)
          .from("products")
          .where("active", false)
          .orderBy("name")
          .limit(10)
          .offset((pageInt - 1) * 10);

        const [count] = await knex("products").where("active", false).count();

        return res.status(201).json({ products, count });
      }
      if (find === "3") {
        const products = await knex
          .select(products_config)
          .from("products")
          .where("promotional", true)
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
          .select(products_config)
          .from("products")
          .orderBy("name")
          .limit(10)
          .offset((pageInt - 1) * 10);

        const [count] = await knex("products").count();

        return res.status(201).json({ products, count });
      }
      if (find === "5") {
        if (name === "All") {
          const products = await knex
            .select(products_config)
            .from("products")
            .orderBy("name")
            .limit(10)
            .offset((pageInt - 1) * 10);

          const [count] = await knex("products").count();

          return res.status(201).json({ products, count });
        } else {
          const products = await knex
            .select(products_config)
            .from("products")
            .where("name", "like", `%${name}%`)
            .orderBy("name")
            .limit(10)
            .offset((pageInt - 1) * 10);

          const [count] = await knex("products")
            .where("name", "like", `%${name}%`)
            .count();

          return res.status(201).json({ products, count });
        }
      }

      if (find === "6") {
        if (name === "All") {
          const products = await knex
            .select(products_config)
            .from("products")
            .innerJoin(
              "departments",
              "departments.id",
              "products.departments_id"
            )
            .innerJoin("categories", "categories.id", "products.categories_id")
            .orderBy("name")
            .limit(10)
            .offset((pageInt - 1) * 10);

          const [count] = await knex("products").count();

          return res.status(201).json({ products, count });
        } else {
          const products = await knex
            .select(products_config)
            .from("products")
            .where("products.sku", "like", `%${name}%`)
            .innerJoin(
              "departments",
              "departments.id",
              "products.departments_id"
            )
            .innerJoin("categories", "categories.id", "products.categories_id")
            .orderBy("name")
            .limit(10)
            .offset((pageInt - 1) * 10);

          const [count] = await knex("products")
            .where("products.sku", "like", `%${name}%`)
            .count();

          return res.status(201).json({ products, count });
        }
      }
    } catch (error) {
      const errorMessage = error.message;
      return res.status(400).json({
        message: "Ocorreu um erro ao buscar os produtos",
        errorMessage,
      });
    }
  },

  async ShowPdv(req, res) {
    const { page, name, sku, barcode } = req.params;
    const pageInt = parseInt(page);

    try {
      if (name !== "All") {
        const products = await knex
          .select(products_config)
          .from("products")
          .where("name", "like", `%${name}%`)
          .orderBy("name")
          .limit(10)
          .offset((pageInt - 1) * 10);

        const [count] = await knex("products")
          .where("name", "like", `%${name}%`)
          .count();

        return res.status(201).json({ products, count });
      }
      if (sku !== "All") {
        const products = await knex
          .select(products_config)
          .from("products")
          .where("sku", "like", `%${sku}%`)
          .orderBy("name")
          .limit(10)
          .offset((pageInt - 1) * 10);

        const [count] = await knex("products")
          .where("sku", "like", `%${sku}%`)
          .count();

        return res.status(201).json({ products, count });
      }
      if (barcode !== "All") {
        const products = await knex
          .select(products_config)
          .from("products")
          .where("barcode", "like", `%${barcode}%`)
          .orderBy("name")
          .limit(10)
          .offset((pageInt - 1) * 10);

        const [count] = await knex("products")
          .where("barcode", "like", `%${barcode}%`)
          .count();

        return res.status(201).json({ products, count });
      }

      const products = await knex
        .select(products_config)
        .from("products")
        .where("active", true)
        .orderBy("name")
        .limit(10)
        .offset((pageInt - 1) * 10);

      const [count] = await knex("products").where("active", true).count();

      return res.status(201).json({ products, count });
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
      const departments = await knex
        .select("*")
        .table("departments")
        .where({ active: true })
        .orderBy("name");
      const providers = await knex
        .select("*")
        .table("providers")
        .where({ active: true })
        .orderBy("name");
      return res.status(201).json({ departments, providers });
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
      provider_code,
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
      icms_base_calc,
      imcs_st_base_calc,
      fcp_base_calc,
      fcp_st_base_calc,
      pis_base_calc,
      cofins_base_calc,
      stock,
    } = req.body;

    try {
      const product = await knex("products")
        .where({ id: id })
        .update({
          name,
          description,
          sku,
          provider_code,
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
          icms_base_calc,
          imcs_st_base_calc,
          fcp_base_calc,
          fcp_st_base_calc,
          pis_base_calc,
          cofins_base_calc,
          stock,
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
        .select(products_config)
        .from("products")
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
    const {
      promotional,
      promotional_value,
      promotional_rate,
      tag_name,
      tag_id,
    } = req.body;

    let namePromo;
    let idPromo;

    if (promotional === true) {
      namePromo = tag_name;
      idPromo = tag_id;
    } else {
      namePromo = "";
      idPromo = 0;
    }

    try {
      const product = await knex("products")
        .where({ id: id })
        .update({
          promotional,
          promotional_value,
          promotional_rate,
          tag_name: namePromo,
          tag_id: idPromo,
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
      const product = await knex("products")
        .where({ id: id })
        .update({ stock: amount })
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
