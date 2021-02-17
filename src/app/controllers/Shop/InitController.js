const knex = require("../../../database/pg");
const bcrypt = require("bcrypt");
const config = require("../../../configs/configs");

module.exports = {
  async InitialController() {
    const validator = await knex.select().table("employees");
    const hash = await bcrypt.hash(config.userPass, 10);
    try {
      if (!validator.length) {
        const novo = await knex("employees").insert({
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
        });
        console.log(novo);
      } else {
        console.log("Saiu");
      }
    } catch (error) {
      console.log(error);
    }
  },
};
