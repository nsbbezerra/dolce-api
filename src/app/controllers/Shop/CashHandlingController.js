//const CashHandling = require("../../models/cashHandling");
//const Employee = require("../../models/employee");

module.exports = {
  async Stores(req, res) {
    const { cashier, description, value, typeHandling } = req.body;
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

      await CashHandling.create({
        cashier,
        description,
        value,
        typeHandling,
        employee: auth,
      });

      return res
        .status(201)
        .json({ message: "Lançamento cadastrado com sucesso" });
    } catch (error) {
      const errorMessage = error.message;
      return res.status(400).json({
        message: "Ocorreu um erro ao lançar o movimento de caixa",
        errorMessage,
      });
    }
  },

  async Index(req, res) {
    const { cashier } = req.params;
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
      const handling = await CashHandling.find({ cashier });
      return res.status(200).json(handling);
    } catch (error) {
      const errorMessage = error.message;
      return res.status(400).json({
        message: "Ocorreu um erro ao buscar os movimentos do caixa",
        errorMessage,
      });
    }
  },

  async Edit(req, res) {
    const { id } = req.params;
    const { cashier, description, value, typeHandling } = req.body;
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
      const handling = await CashHandling.findOneAndUpdate(
        { _id: id },
        { $set: { cashier, description, value, typeHandling } },
        { new: true }
      );
      return res
        .status(200)
        .json({ message: "Lançamento alterado com sucesso", handling });
    } catch (error) {
      const errorMessage = error.message;
      return res.status(400).json({
        message: "Ocorreu um erro ao editar o movimento de caixa",
        errorMessage,
      });
    }
  },

  async Remove(req, res) {
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
      await CashHandling.findOneAndDelete({ _id: id });

      return res
        .status(200)
        .json({ message: "Lançamento excluído com sucesso" });
    } catch (error) {
      const errorMessage = error.message;
      return res.status(400).json({
        message: "Ocorreu um erro ao excluir o movimento de caixa",
        errorMessage,
      });
    }
  },
};
