const knex = require("../../../database/pg");
const bycrypt = require("bcrypt");

module.exports = {
  async Store(req, res) {
    const { name, gender, cpf, email, contact, user, password } = req.body;
    const hash = await bycrypt.hash(password, 10);
    try {
      const [id] = await knex("clients")
        .insert({
          name,
          gender,
          cpf,
          email,
          contact,
          user,
          password: hash,
        })
        .returning("id");
      console.log(id);
      return res
        .status(201)
        .json({ message: "Cliente cadastrado com sucesso", client: id });
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
      const clients = await knex
        .select(
          "id",
          "name",
          "gender",
          "email",
          "contact",
          "cpf",
          "user",
          "active",
          "restrict"
        )
        .table("clients");
      return res.status(201).json(clients);
    } catch (error) {
      const errorMessage = error.message;
      return res.status(400).json({
        message: "Ocorreu um erro ao buscar os clientes",
        errorMessage,
      });
    }
  },
};
