const Employee = require("../../models/employee");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const configs = require("../../../configs/configs");
const Blacklist = require("../../models/blacklist");

module.exports = {
  async Store(req, res) {
    const {
      name,
      gender,
      contact,
      admin,
      sales,
      caixa,
      comission,
      comissioned,
      user,
      password,
    } = req.body;
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
      const userFind = await Employee.findOne({ user: user });
      if (userFind) {
        return res
          .status(400)
          .json({ message: "Este nome de usuário já existe" });
      }
      await Employee.create({
        name,
        gender,
        contact,
        admin,
        sales,
        caixa,
        comission,
        comissioned,
        user,
        password,
      });
      const employers = await Employee.find().sort({ name: 1 });
      return res
        .status(201)
        .json({ message: "Colaborador cadastrado com sucesso", employers });
    } catch (error) {
      const errorMessage = error.message;
      return res.status(400).json({
        message: "Ocorreu um erro ao cadastrar o colaborador",
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
      const employers = await Employee.find().sort({ name: 1 });
      return res.status(200).json(employers);
    } catch (error) {
      const errorMessage = error.message;
      return res.status(400).json({
        message: "Ocorreu um erro ao buscar os colaboradores",
        errorMessage,
      });
    }
  },

  async Edit(req, res) {
    const { id } = req.params;
    const {
      name,
      gender,
      contact,
      admin,
      sales,
      caixa,
      comission,
      comissioned,
      user,
    } = req.body;
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
      await Employee.findOneAndUpdate(
        { _id: id },
        {
          $set: {
            name,
            gender,
            contact,
            admin,
            sales,
            caixa,
            comission,
            comissioned,
            user,
          },
        }
      );
      const employers = await Employee.find().sort({ name: 1 });
      return res
        .status(200)
        .json({ message: "Alteração feita com sucesso", employers });
    } catch (error) {
      const errorMessage = error.message;
      return res.status(400).json({
        message: "Ocorreu um erro ao editar o colaborador",
        errorMessage,
      });
    }
  },

  async Password(req, res) {
    const { id } = req.params;
    const { password } = req.body;
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
      const employee = await Employee.findOne({ _id: id }).select("+password");
      employee.password = password;
      employee.save();
      return res.status(200).json({ message: "Alteração feita com sucesso" });
    } catch (error) {
      const errorMessage = error.message;
      return res.status(400).json({
        message: "Ocorreu um erro ao editar o colaborador",
        errorMessage,
      });
    }
  },

  async Block(req, res) {
    const { id } = req.params;
    const { active } = req.body;
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
      await Employee.findOneAndUpdate({ _id: id }, { $set: { active } });
      const employers = await Employee.find().sort({ name: 1 });
      return res
        .status(200)
        .json({ message: "Alteração feita com sucesso", employers });
    } catch (error) {
      const errorMessage = error.message;
      return res.status(400).json({
        message: "Ocorreu um erro ao bloquear/ativar o colaborador",
        errorMessage,
      });
    }
  },

  async Autenticate(req, res) {
    const { user, password } = req.body;
    try {
      const employee = await Employee.findOne({ user: user }).select(
        "+password"
      );
      if (!employee) {
        return res.status(400).json({ message: "Colaborador não encontrado" });
      }
      if (!(await bcrypt.compare(password, employee.password))) {
        return res.status(400).json({ message: "Senha Inválida" });
      }
      if (!employee.active) {
        return res.status(400).json({ message: "Colaborador não autorizado" });
      }
      const expire = 36000; //10 horas em segundos
      const token = jwt.sign({ userId: employee._id }, configs.secret, {
        expiresIn: expire,
      });
      await Employee.findOneAndUpdate({ user: user }, { $set: { token } });
      const permissions = {
        admin: employee.admin,
        sales: employee.sales,
        cashier: employee.caixa,
      };
      const data = { token: token, user: employee._id, permissions };
      return res.status(200).json(data);
    } catch (error) {
      const errorMessage = error.message;
      return res.status(400).json({
        message: "Ocorreu uma falha ao autenticar",
        errorMessage,
      });
    }
  },

  async Logout(req, res) {
    const { token } = req.body;

    try {
      await Blacklist.create({ token });
      return res.status(201).end();
    } catch (error) {
      const errorMessage = error.message;
      return res.status(400).json({
        message: "Ocorreu uma falha ao fazer o logout",
        errorMessage,
      });
    }
  },
};
