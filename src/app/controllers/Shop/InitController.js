const knex = require("../../../database/pg");
const bcrypt = require("bcrypt");
const config = require("../../../configs/configs");

module.exports = {
  async InitialController() {
    const validator = await knex
      .select()
      .table("employees")
      .where({ name: "admin" });
    const hash = await bcrypt.hash(config.userPass, 10);
    const data = new Date();
    try {
      if (!validator.length) {
        const [id] = await knex("employees")
          .insert({
            name: "admin",
            gender: "masc",
            contact: "(00) 00000-0000",
            user: "admin",
            password: hash,
            admin: true,
            sales: false,
            caixa: false,
            comission: 0.0,
            comissioned: false,
          })
          .returning("id");
        console.log("LOGIN CRIADO");
      }
      const cashier = await knex.select("*").from("cashier");
      if (cashier.length === 0) {
        await knex("cashier").insert({
          employee_id: id,
          open_value: 0,
          status: "open",
          open_date: data,
          month: data.toLocaleString("pt-BR", { month: "long" }),
          year: data.getFullYear().toString(),
        });
        console.log("CAIXA CRIADO");
      }
      const plan = await knex
        .select("*")
        .from("planAccounts")
        .where({ name: "Venda De Produtos" })
        .first();
      if (!plan) {
        await knex("planAccounts").insert({
          plan: "1.1.01",
          name: "Venda De Produtos",
          mode: "credit",
        });
        await knex("planAccounts").insert({
          plan: "1.1.02",
          name: "Prestação de Serviços",
          mode: "credit",
        });
        console.log("PLANO DE CONTAS CRIADO");
      }
    } catch (error) {
      console.log(error);
    }
  },
};
