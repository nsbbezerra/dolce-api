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

  async ShowWithAdress(req, res) {
    try {
      const clients = await knex
        .select([
          "clients.id",
          "clients.name",
          "clients.gender",
          "clients.email",
          "clients.contact",
          "clients.cpf",
          "clients.user",
          "clients.active",
          "clients.restrict",
          "addresses.id as addresses_id",
          "addresses.street",
          "addresses.number",
          "addresses.comp",
          "addresses.bairro",
          "addresses.city",
          "addresses.cep",
          "addresses.state",
        ])
        .table("clients")
        .innerJoin("addresses", "addresses.client_id", "clients.id")
        .orderBy("clients.name");
      return res.status(201).json(clients);
    } catch (error) {
      const errorMessage = error.message;
      return res.status(400).json({
        message: "Ocorreu um erro ao buscar os clientes",
        errorMessage,
      });
    }
  },

  async Update(req, res) {
    const { id } = req.params;
    const { name, gender, cpf, email, contact, user, password } = req.body;
    const hash = await bycrypt.hash(password, 10);
    try {
      const client = await knex("clients")
        .where({ id: id })
        .update({ name, gender, cpf, email, contact, user, password: hash })
        .returning("*");
      return res
        .status(201)
        .json({ message: "Alteração concluída com sucesso", client });
    } catch (error) {
      const errorMessage = error.message;
      return res.status(400).json({
        message: "Ocorreu um erro ao editar o cliente",
        errorMessage,
      });
    }
  },

  async Active(req, res) {
    const { id } = req.params;
    const { active } = req.body;

    try {
      const client = await knex("clients")
        .where({ id: id })
        .update({ active })
        .returning("*");
      return res
        .status(201)
        .json({ message: "Alteração concluída com sucesso", client });
    } catch (error) {
      const errorMessage = error.message;
      return res.status(400).json({
        message: "Ocorreu um erro ao ativar/bloquear o cliente",
        errorMessage,
      });
    }
  },

  async Restrict(req, res) {
    const { id } = req.params;
    const { restrict } = req.body;

    try {
      const client = await knex("clients")
        .where({ id: id })
        .update({ restrict })
        .returning("*");
      return res
        .status(201)
        .json({ message: "Alteração concluída com sucesso", client });
    } catch (error) {
      const errorMessage = error.message;
      return res.status(400).json({
        message: "Ocorreu um erro ao ativar/bloquear o cliente",
        errorMessage,
      });
    }
  },
};
