const knex = require("../../../database/pg");
const faker = require("faker-br");
const uniqid = require("uniqid");

module.exports = {
  async StoreDepartments(req, res) {
    try {
      async function Store() {
        await knex("departments").insert({
          name: faker.commerce.department(),
          description: faker.commerce.productAdjective(),
        });
      }
      for (let index = 0; index < 3; index++) {
        Store();
      }

      return res.status(201).json({ message: "Cadastramento concluído" });
    } catch (error) {
      return res.status(400).json(error);
    }
  },

  async StoreCategory(req, res) {
    try {
      async function Store(id) {
        await knex("categories").insert({
          name: faker.commerce.department(),
          departments_id: id + 1,
          description: faker.commerce.productAdjective(),
        });
      }

      for (let index = 0; index < 3; index++) {
        Store(index);
      }

      return res.status(201).json({ message: "Cadastrametno concluído" });
    } catch (error) {
      return res.status(400).json(error);
    }
  },

  async StoreProducts(req, res) {
    try {
      async function Store() {
        await knex("products").insert({
          departments_id: 3,
          categories_id: 3,
          name: faker.commerce.productName(),
          identify: uniqid(),
          description: faker.commerce.product(),
          sku: faker.random.uuid(),
          barcode: faker.random.uuid(),
          cost_value: faker.commerce.price(),
          other_cost: faker.commerce.price(),
          sale_value: faker.commerce.price(),
          freight_weight: faker.commerce.price(),
          freight_width: faker.commerce.price(),
          freight_height: faker.commerce.price(),
          freight_diameter: faker.commerce.price(),
          freight_length: faker.commerce.price(),
          thumbnail: "produto2.jpeg",
          providers_id: 1,
          information: faker.lorem.slug(),
          sub_cat_id: 3,
        });
      }

      for (let index = 0; index < 10; index++) {
        Store();
      }

      return res.status(201).json({ message: "Cadastramento concluído" });
    } catch (error) {
      return res.status(400).json(error);
    }
  },

  async StoreSubCat(req, res) {
    try {
      async function Store(id) {
        await knex("subCat").insert({
          name: faker.commerce.department(),
          categories_id: id + 1,
          description: faker.commerce.productAdjective(),
        });
      }

      for (let index = 0; index < 3; index++) {
        Store(index);
      }

      return res.status(201).json({ message: "Cadastrametno concluído" });
    } catch (error) {
      return res.status(400).json(error);
    }
  },
};
