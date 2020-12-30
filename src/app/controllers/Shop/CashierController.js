const Cashier = require("../../models/cashier");
const Employee = require("../../models/employee");
const CashHandling = require("../../models/cashHandling");
const Payments = require("../../models/payments");

const meses = new Array(
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro"
);

const DateNow = new Date();
const day = DateNow.getDate();
const month = DateNow.getMonth() + 1;
const year = DateNow.getFullYear();

module.exports = {
  async Open(req, res) {
    const { valueOpened, movimentDate } = req.body;
    const auth = req.userId;
    const valueClosed = 0;
    const balance = valueOpened - valueClosed;

    try {
      const findAuth = await Employee.findOne({ _id: auth }).select(
        "+premission"
      );

      if (!findAuth || findAuth.premission !== "shop") {
        return res
          .status(401)
          .json({ message: "Usuário sem permissão para esta ação" });
      }
      await Cashier.create({
        employee: auth,
        valueOpened,
        valueClosed,
        balance,
        movimentDate,
        status: "open",
        month: meses[month - 1],
        year,
      });
      const monthFind = meses[month - 1];
      const cashier = await Cashier.find({ month: monthFind, year }).sort({
        movimentDate: -1,
      });
      return res.status(201).json({ message: "Caixa Aberto", cashier });
    } catch (error) {
      const errorMessage = error.message;
      return res.status(400).json({
        message: "Ocorreu um erro ao abrir o caixa",
        errorMessage,
      });
    }
  },

  async FindOpen(req, res) {
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
      const cashier = await Cashier.find({ status: "open" }).sort({
        movimentDate: -1,
      });
      return res.status(200).json(cashier);
    } catch (error) {
      const errorMessage = error.message;
      return res.status(400).json({
        message: "Ocorreu um erro ao buscar o caixa",
        errorMessage,
      });
    }
  },

  async FindClose(req, res) {
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
      const cashier = await Cashier.find({ status: "close" }).sort({
        movimentDate: -1,
      });
      return res.status(200).json(cashier);
    } catch (error) {
      const errorMessage = error.message;
      return res.status(400).json({
        message: "Ocorreu um erro ao buscar o caixa",
        errorMessage,
      });
    }
  },

  /** ESSE MÉTODO ABAIXO ESTÁ INCOMPLETO */

  async Close(req, res) {
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

      const cashier = await Cashier.findOne({ _id: id });
      const payments = await Payments.find({ cashier: id });
      const cashHandlingRevenue = await CashHandling.find({
        cashier: id,
        typeHandling: "revenue",
      });

      const cashHandlingExpense = await CashHandling.find({
        cashier: id,
        typeHandling: "expense",
      });

      let totalRevenues = cashHandlingRevenue.reduce(function (total, numero) {
        return total + numero;
      });

      let totalExpenses = cashHandlingExpense.reduce(function (total, numero) {
        return total + numero;
      });
    } catch (error) {
      const errorMessage = error.message;
      return res.status(400).json({
        message: "Ocorreu um erro ao fechar o caixa",
        errorMessage,
      });
    }
  },
};
