const BankAccount = require("../models/bankAccount");

module.exports = {
  async Store(req, res) {
    const { bank, value } = req.body;
    try {
      await BankAccount.create({ bank, value });
      const bankAccount = await BankAccount.find().sort({ bank: 1 });
      return res.status(201).json({
        message: "Conta Bancária cadastrada com sucesso",
        bankAccount,
      });
    } catch (error) {
      return res
        .status(400)
        .json({ message: "Ocorreu um erro cadastrar a conta bancária", error });
    }
  },

  async Show(req, res) {
    try {
      const bankAccount = await BankAccount.find().sort({ bank: 1 });
      return res.status(200).json(bankAccount);
    } catch (error) {
      return res
        .status(400)
        .json({ message: "Ocorreu um erro buscar as contas bancárias", error });
    }
  },

  async Edit(req, res) {
    const { id } = req.params;
    const { bank, value } = req.body;

    try {
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
      return res
        .status(400)
        .json({ message: "Ocorreu um erro editar a conta bancária", error });
    }
  },

  async Block(req, res) {
    const { id, active } = req.body;

    try {
      await BankAccount.findOneAndUpdate({ _id: id }, { $set: { active } });
      const bankAccount = await BankAccount.find().sort({ bank: 1 });
      return res
        .status(200)
        .json({ message: "Alteração realizada com sucesso", bankAccount });
    } catch (error) {
      return res
        .status(400)
        .json({ message: "Ocorreu um erro excluir a conta bancária", error });
    }
  },
};
