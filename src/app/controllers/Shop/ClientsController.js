const Clientes = require("../../models/clients");

module.exports = {
  async Store(req, res) {
    const { name, gender, cpf, email, contact, user, password } = req.body;
    try {
      const findClient = await Clientes.findOne({ cpf });
      const findUser = await Clientes.findOne({ user });

      if (findClient) {
        return res.status(400).json({
          message: "CPF já cadastrado",
          errorMessage: "Cod: 400",
        });
      }

      if (findUser) {
        return res.status(400).json({
          message: "Usuário já cadastrado",
          errorMessage: "Cod: 400",
        });
      }

      const client = await Clientes.create({
        name,
        gender,
        cpf,
        email,
        contact,
        user,
        password,
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
