const Addresses = require("../models/address");

module.exports = {
  async Store(req, res) {
    const { client, street, number, comp, bairro, cep, city, state } = req.body;
    try {
      await Addresses.create({
        client,
        street,
        number,
        comp,
        bairro,
        cep,
        city,
        state,
      });
      const addresses = await Addresses.find({ client: client }).sort({
        createDate: 1,
      });
      return res
        .status(201)
        .json({ message: "Cadastro efetuado com sucesso", addresses });
    } catch (error) {
      return res
        .status(400)
        .json({ message: "Ocorreu um erro ao efetuar o cadastro", error });
    }
  },

  async Index(req, res) {
    const { id } = req.params;
    try {
      const addresses = await Addresses.find({ client: id }).sort({
        createDate: 1,
      });
      return res.status(200).json(addresses);
    } catch (error) {
      return res
        .status(400)
        .json({ message: "Ocorreu um erro ao buscar os endereços", error });
    }
  },

  async Edit(req, res) {
    const { id } = req.params;
    const { street, number, comp, bairro, cep, city, state } = req.body;

    try {
      await Addresses.findOneAndUpdate(
        { _id: id },
        { $set: { street, number, comp, bairro, cep, city, state } }
      );
      const addresses = await Addresses.find({ client: id }).sort({
        createDate: 1,
      });
      return res
        .status(201)
        .json({ message: "Alteração efetuada com sucesso", addresses });
    } catch (error) {
      return res
        .status(400)
        .json({ message: "Ocorreu um erro ao editar o endereço", error });
    }
  },

  async Remove(res, req) {
    const { id } = req.params;
    try {
      await Addresses.findOneAndDelete({ _id: id });
      return res.status(200).json({ message: "Endereço excluído com sucesso" });
    } catch (error) {
      return res
        .status(400)
        .json({ message: "Ocorreu um erro ao excluir o endereço", error });
    }
  },
};
