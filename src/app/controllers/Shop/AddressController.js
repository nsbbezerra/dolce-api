const Addresses = require("../../models/address");
const Employee = require("../../models/employee");

module.exports = {
  async Store(req, res) {
    const { client, street, number, comp, bairro, cep, city, state } = req.body;
    const auth = req.userId;
    try {
      const findAuth = await Employee.findOne({ _id: auth }).select(
        "+premission"
      );
      if (!findAuth || findAuth.premission !== "shop") {
        return res
          .status(401)
          .json({ message: "Usuário sem permissão para esta ação" });
      }
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
      const errorMessage = error.message;
      return res.status(400).json({
        message: "Ocorreu um erro ao efetuar o cadastro",
        errorMessage,
      });
    }
  },

  async Index(req, res) {
    const { id } = req.params;
    const auth = req.userId;
    try {
      const findAuth = await Employee.findOne({ _id: auth }).select(
        "+premission"
      );
      if (!findAuth || findAuth.premission !== "shop") {
        return res
          .status(401)
          .json({ message: "Usuário sem permissão para esta ação" });
      }
      const addresses = await Addresses.find({ client: id }).sort({
        createDate: 1,
      });
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
    const auth = req.userId;
    try {
      const findAuth = await Employee.findOne({ _id: auth }).select(
        "+premission"
      );
      if (!findAuth || findAuth.premission !== "shop") {
        return res
          .status(401)
          .json({ message: "Usuário sem permissão para esta ação" });
      }
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
      const errorMessage = error.message;
      return res.status(400).json({
        message: "Ocorreu um erro ao editar o endereço",
        errorMessage,
      });
    }
  },

  async Remove(res, req) {
    const { id } = req.params;
    const auth = req.userId;
    try {
      const findAuth = await Employee.findOne({ _id: auth }).select(
        "+premission"
      );
      if (!findAuth || findAuth.premission !== "shop") {
        return res
          .status(401)
          .json({ message: "Usuário sem permissão para esta ação" });
      }
      await Addresses.findOneAndDelete({ _id: id });
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
