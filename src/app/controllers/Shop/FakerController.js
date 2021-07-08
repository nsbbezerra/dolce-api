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
          identify: uniqid("produto-"),
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
          thumbnail: "produto.jpg",
          providers_id: 2,
          information: faker.lorem.slug(),
        });
      }

      for (let index = 0; index < 5; index++) {
        Store();
      }

      return res.status(201).json({ message: "Cadastramento concluído" });
    } catch (error) {
      return res.status(400).json(error);
    }
  },
};
