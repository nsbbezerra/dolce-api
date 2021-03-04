const knex = require("../../../database/pg");

module.exports = {
  async Store(req, res) {
    const {
      client_id,
      street,
      number,
      comp,
      bairro,
      cep,
      city,
      state,
    } = req.body;
    try {
      const address = await knex("addresses")
        .insert({
          client_id,
          street,
          number,
          comp,
          bairro,
          cep,
          city,
          state,
        })
        .returning("*");
      return res
        .status(201)
        .json({ message: "Cadastro efetuado com sucesso", address });
    } catch (error) {
      const errorMessage = error.message;
      return res.status(400).json({
        message: "Ocorreu um erro ao efetuar o cadastro",
        errorMessage,
      });
    }
  },

  async Index(req, res) {
    const { id } = req.params;
    try {
      const addresses = await knex("addresses")
        .where({ client_id: id })
        .select("*");
      return res.status(200).json(addresses);
    } catch (error) {
      const errorMessage = error.message;
      return res.status(400).json({
        message: "Ocorreu um erro ao buscar os endereços",
        errorMessage,
      });
    }
  },

  async Edit(req, res) {
    const { id } = req.params;
    const { street, number, comp, bairro, cep, city, state } = req.body;
    try {
      const address = await knex("addresses")
        .where({ id: id })
        .update({ street, number, comp, bairro, cep, city, state })
        .returning("*");
      return res
        .status(201)
        .json({ message: "Alteração efetuada com sucesso", address });
    } catch (error) {
      const errorMessage = error.message;
      return res.status(400).json({
        message: "Ocorreu um erro ao editar o endereço",
        errorMessage,
      });
    }
  },

  async Remove(req, res) {
    const { id } = req.params;
    try {
      await knex("addresses").where({ id: id }).del();
      return res.status(200).json({ message: "Endereço excluído com sucesso" });
    } catch (error) {
      const errorMessage = error.message;
      return res.status(400).json({
        message: "Ocorreu um erro ao excluir o endereço",
        errorMessage,
      });
    }
  },
};
