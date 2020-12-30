const Employee = require("../models/employee");

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

    try {
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
      return res
        .status(400)
        .json({ message: "Ocorreu um erro ao cadastrar o colaborador", error });
    }
  },

  async Show(req, res) {
    try {
      const employers = await Employee.find().sort({ name: 1 });
      return res.status(200).json(employers);
    } catch (error) {
      return res
        .status(400)
        .json({ message: "Ocorreu um erro ao buscar os colaboradores", error });
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

    try {
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
      return res
        .status(400)
        .json({ message: "Ocorreu um erro ao editar o colaborador", error });
    }
  },

  async Password(req, res) {
    const { id } = req.params;
    const { password } = req.body;

    try {
      const employee = await Employee.findOne({ _id: id }).select("+password");
      employee.password = password;
      employee.save();
      return res.status(200).json({ message: "Alteração feita com sucesso" });
    } catch (error) {
      return res
        .status(400)
        .json({ message: "Ocorreu um erro ao editar o colaborador", error });
    }
  },

  async Block(req, res) {
    const { id } = req.params;
    const { active } = req.body;
    try {
      await Employee.findOneAndUpdate({ _id: id }, { $set: { active } });
      const employers = await Employee.find().sort({ name: 1 });
      return res
        .status(200)
        .json({ message: "Alteração feita com sucesso", employers });
    } catch (error) {
      return res
        .status(400)
        .json({
          message: "Ocorreu um erro ao bloquear/ativar o colaborador",
          error,
        });
    }
  },
};
