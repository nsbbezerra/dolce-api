const knex = require("../../../database/pg");

const products_config = [
  "products.id",
  "products.name",
  "products.thumbnail",
  "products.description",
  "products.identify",
  "products.sku",
  "products.barcode",
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
];

module.exports = {
  async Home(req, res) {
    try {
      const departments = await knex
        .select("*")
        .from("departments")
        .where({ active: true })
        .orderBy("name");
      const categories = await knex
        .select("*")
        .from("categories")
        .where({ active: true })
        .orderBy("name");
      const promo = await knex
        .select("*")
        .from("tags")
        .where({ active: true })
        .orderBy("created_at", "desc");
      return res.status(200).json({ departments, categories, promo });
    } catch (error) {
      const errorMessage = error.message;
      return res.status(400).json({
        message: "Ocorreu um erro ao buscar as informações",
        errorMessage,
      });
    }
  },

  async HomeProducts(req, res) {
    const { find, cats, page } = req.params;
    const pageInt = parseInt(page);
    const catsParse = JSON.parse(cats);
    try {
      if (find === "1") {
        const products = await knex
          .select(products_config)
          .from("products")
          .where("products.active", true)
          .innerJoin("departments", "departments.id", "products.departments_id")
          .innerJoin("categories", "categories.id", "products.categories_id")
          .orderBy("products.name")
          .limit(12)
          .offset((pageInt - 1) * 12);

        const [count] = await knex("products")
          .where("products.active", true)
          .count();

        return res.status(200).json({ products, count });
      }
      if (find === "4") {
        const products = await knex
          .select(products_config)
          .from("products")
          .where("products.promotional", true)
          .innerJoin("departments", "departments.id", "products.departments_id")
          .innerJoin("categories", "categories.id", "products.categories_id")
          .orderBy("products.name")
          .limit(12)
          .offset((pageInt - 1) * 12);

        const [count] = await knex("products")
          .where("products.promotional", true)
          .count();

        return res.status(200).json({ products, count });
      }
      if (find === "2") {
        const products = await knex
          .select(products_config)
          .from("products")
          .where("products.active", true)
          .innerJoin("departments", "departments.id", "products.departments_id")
          .innerJoin("categories", "categories.id", "products.categories_id")
          .orderBy("products.created_at", "desc")
          .limit(12)
          .offset((pageInt - 1) * 12);

        const [count] = await knex("products")
          .where("products.active", true)
          .count();

        return res.status(200).json({ products, count });
      }
      if (find === "5") {
        const products = await knex
          .select(products_config)
          .from("products")
          .whereIn("products.categories_id", catsParse)
          .innerJoin("departments", "departments.id", "products.departments_id")
          .innerJoin("categories", "categories.id", "products.categories_id")
          .innerJoin("providers", "providers.id", "products.providers_id")
          .orderBy("products.name")
          .limit(12)
          .offset((pageInt - 1) * 12);

        const [count] = await knex("products")
          .whereIn("products.categories_id", catsParse)
          .count();

        return res.status(200).json({ products, count });
      }
    } catch (error) {
      const errorMessage = error.message;
      return res.status(400).json({
        message: "Ocorreu um erro ao buscar as informações",
        errorMessage,
      });
    }
  },

  async ProductsPage(req, res) {
    try {
      const products = await knex
        .select(products_config)
        .from("products")
        .innerJoin("departments", "departments.id", "products.departments_id")
        .innerJoin("categories", "categories.id", "products.categories_id")
        .innerJoin("providers", "providers.id", "products.providers_id")
        .orderBy("products.name");

      return res.status(200).json(products);
    } catch (error) {
      const errorMessage = error.message;
      return res.status(400).json({
        message: "Ocorreu um erro ao buscar as informações",
        errorMessage,
      });
    }
  },

  async FindByParams(req, res) {
    const { identify } = req.params;

    try {
      const products = await knex
        .select(products_config)
        .from("products")
        .where({ identify })
        .innerJoin("departments", "departments.id", "products.departments_id")
        .innerJoin("categories", "categories.id", "products.categories_id")
        .innerJoin("providers", "providers.id", "products.providers_id")
        .orderBy("products.name");

      return res.status(200).json(products);
    } catch (error) {
      const errorMessage = error.message;
      return res.status(400).json({
        message: "Ocorreu um erro ao buscar as informações",
        errorMessage,
      });
    }
  },

  async FindSizesAndImages(req, res) {
    const { identify } = req.params;

    try {
      const findProduct = await knex
        .select("id")
        .from("products")
        .where({ identify })
        .first();

      const images = await knex
        .select("*")
        .from("images")
        .where({ products_id: findProduct.id });
      const sizes = await knex
        .select("*")
        .from("sizes")
        .where({ products_id: findProduct.id })
        .orderBy("size");

      return res.status(200).json({ images, sizes });
    } catch (error) {
      const errorMessage = error.message;
      return res.status(400).json({
        message: "Ocorreu um erro ao buscar as informações",
        errorMessage,
      });
    }
  },
};
