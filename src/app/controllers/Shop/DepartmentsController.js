const knex = require("../../../database/pg");

module.exports = {
  async Store(req, res) {
    const { name, description } = req.body;
    try {
      const dep = await knex("departments").where({ name }).first();

      if (dep) {
        return res.status(400).json({ message: "Departamento já cadastrado" });
      }

      await knex("departments").insert({
        name,
        description,
      });
      return res
        .status(201)
        .json({ message: "Departamento cadastrado com sucesso" });
    } catch (error) {
      const errorMessage = error.message;
      return res.status(400).json({
        message: "Ocorreu um erro ao cadastrar o departamento",
        errorMessage,
      });
    }
  },

  async Show(req, res) {
    try {
      const departments = await knex
        .select("*")
        .table("departments")
        .orderBy("name");
      return res.status(201).json(departments);
    } catch (error) {
      const errorMessage = error.message;
      return res.status(400).json({
        message: "Ocorreu um erro ao buscar os departamentos",
        errorMessage,
      });
    }
  },

  async Update(req, res) {
    const { id } = req.params;
    const { name, description } = req.body;

    try {
      const department = await knex("departments")
        .where({ id: id })
        .update({ name, description })
        .returning("*");
      return res
        .status(201)
        .json({ message: "Informações alteradas com sucesso", department });
    } catch (error) {
      const errorMessage = error.message;
      return res.status(400).json({
        message: "Ocorreu um erro ao alterar as informações",
        errorMessage,
      });
    }
  },

  async Activate(req, res) {
    const { id } = req.params;
    const { active } = req.body;

    try {
      const department = await knex("departments")
        .where({ id: id })
        .update({ active })
        .returning("*");
      return res
        .status(201)
        .json({ message: "Alteração feita com sucesso", department });
    } catch (error) {
      const errorMessage = error.message;
      return res.status(400).json({
        message: "Ocorreu um erro ao ativar/bloquear o departamento",
        errorMessage,
      });
    }
  },
};
