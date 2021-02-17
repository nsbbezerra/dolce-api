//const BankAccount = require("../../models/bankAccount");
//const Employee = require("../../models/employee");

module.exports = {
  async Store(req, res) {
    const { bank, value } = req.body;
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
      await BankAccount.create({ bank, value });
      const bankAccount = await BankAccount.find().sort({ bank: 1 });
      return res.status(201).json({
        message: "Conta Bancária cadastrada com sucesso",
        bankAccount,
      });
    } catch (error) {
      const errorMessage = error.message;
      return res.status(400).json({
        message: "Ocorreu um erro cadastrar a conta bancária",
        errorMessage,
      });
    }
  },

  async Show(req, res) {
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
      const bankAccount = await BankAccount.find().sort({ bank: 1 });
      return res.status(200).json(bankAccount);
    } catch (error) {
      const errorMessage = error.message;
      return res.status(400).json({
        message: "Ocorreu um erro buscar as contas bancárias",
        errorMessage,
      });
    }
  },

  async Edit(req, res) {
    const { id } = req.params;
    const { bank, value } = req.body;
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
      await BankAccount.findOneAndUpdate(
        { _id: id },
        {
          $set: {
            bank,
            value,
          },
        }
      );

      const bankAccount = await BankAccount.find().sort({ bank: 1 });
      return res.status(200).json({
        message: "Conta Bancária atualizada com sucesso",
        bankAccount,
      });
    } catch (error) {
      const errorMessage = error.message;
      return res.status(400).json({
        message: "Ocorreu um erro editar a conta bancária",
        errorMessage,
      });
    }
  },

  async Block(req, res) {
    const { id, active } = req.body;
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
      await BankAccount.findOneAndUpdate({ _id: id }, { $set: { active } });
      const bankAccount = await BankAccount.find().sort({ bank: 1 });
      return res
        .status(200)
        .json({ message: "Alteração realizada com sucesso", bankAccount });
    } catch (error) {
      const errorMessage = error.message;
      return res.status(400).json({
        message: "Ocorreu um erro excluir a conta bancária",
        errorMessage,
      });
    }
  },
};
