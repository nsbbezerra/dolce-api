const Employee = require("../../models/employee");
const Validator = require("../../models/validator");

module.exports = {
  async InitialController() {
    const validator = await Validator.find();

    try {
      if (!validator.length) {
        const employee = await Employee.create({
          name: "Admin",
          gender: "masc",
          admin: true,
          sales: false,
          caixa: false,
          comissioned: false,
          user: "admin",
          password: "admin",
          premission: "shop",
        });

        await Validator.create({ initiate: true });
        console.log(employee);
      }
      console.log("Cadastrado");
    } catch (error) {
      const errorMessage = error.message;
      return res.status(400).json({
        message: "Ocorreu uma falha ao iniciar",
        errorMessage,
      });
      console.log(error);
    }
  },
};
