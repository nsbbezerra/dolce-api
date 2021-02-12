const Clientes = require("../../models/clients");

module.exports = {
  async Store(req, res) {
    console.log("RECEBEU");
    const { name, gender, cpf, email, contact, user } = req.body;

    try {
      const client = await Clientes.create({
        name,
        gender,
        cpf,
        email,
        contact,
        user,
      });
      return res
        .status(201)
        .json({ message: "Cadastro efetuado com sucesso", client });
    } catch (error) {
      const errorMessage = error.message;
      return res.status(400).json({
        message: "Ocorreu um erro ao efetuar o cadastro",
        errorMessage,
      });
    }
  },
};
