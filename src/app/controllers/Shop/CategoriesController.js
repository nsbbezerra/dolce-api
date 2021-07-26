const knex = require("../../../database/pg");

module.exports = {
  async Store(req, res) {
    const { name, description, department } = req.body;
    try {
      const cat = await knex("categories")
        .where({ departments_id: department, name })
        .first();

      if (cat) {
        return res.status(400).json({ message: "Categoria já cadastrada" });
      }

      await knex("categories").insert({
        name,
        departments_id: department,
        description,
      });
      return res.status(201).json({ message: "Cadastro efetuado com sucesso" });
    } catch (error) {
      const errorMessage = error.message;
      return res.status(400).json({
        message: "Ocorreu um erro ao cadastrar a categoria",
        errorMessage,
      });
    }
  },

  async Show(req, res) {
    try {
      const categories = await knex
        .select([
          "categories.id",
          "categories.name",
          "categories.description",
          "categories.active",
          "departments.name as dep_name",
        ])
        .from("categories")
        .innerJoin(
          "departments",
          "departments.id",
          "categories.departments_id"
        );

      return res.status(201).json(categories);
    } catch (error) {
      const errorMessage = error.message;
      return res.status(400).json({
        message: "Ocorreu um erro ao cadastrar o departamento",
        errorMessage,
      });
    }
  },

  async ShowWithPagination(req, res) {
    const { page, text } = req.params;
    const pageInt = parseInt(page);

    try {
      if (text === "All") {
        const categories = await knex
          .select([
            "categories.id",
            "categories.name",
            "categories.description",
            "categories.active",
            "departments.name as dep_name",
          ])
          .from("categories")
          .innerJoin(
            "departments",
            "departments.id",
            "categories.departments_id"
          )
          .orderBy("categories.name")
          .limit(10)
          .offset((pageInt - 1) * 10);
        const [count] = await knex("categories").count();
        return res.status(201).json({ categories, count });
      } else {
        const categories = await knex
          .select([
            "categories.id",
            "categories.name",
            "categories.description",
            "categories.active",
            "departments.name as dep_name",
          ])
          .from("categories")
          .where("categories.name", "like", `%${text}%`)
          .innerJoin(
            "departments",
            "departments.id",
            "categories.departments_id"
          )
          .orderBy("categories.name")
          .limit(10)
          .offset((pageInt - 1) * 10);
        const [count] = await knex("categories")
          .where("categories.name", "like", `%${text}%`)
          .count();
        return res.status(201).json({ categories, count });
      }
    } catch (error) {
      const errorMessage = error.message;
      return res.status(400).json({
        message: "Ocorreu um erro ao cadastrar o departamento",
        errorMessage,
      });
    }
  },

  async Update(req, res) {
    const { id } = req.params;
    const { name, description } = req.body;

    try {
      const category = await knex("categories")
        .where({ id: id })
        .update({ name, description })
        .returning("*");
      return res
        .status(201)
        .json({ message: "Informações alteradas com sucesso", category });
    } catch (error) {
      const errorMessage = error.message;
      return res.status(400).json({
        message: "Ocorreu um erro ao alterar as informações",
        errorMessage,
      });
    }
  },

  async Active(req, res) {
    const { id } = req.params;
    const { active } = req.body;

    try {
      const category = await knex("categories")
        .where({ id: id })
        .update({ active })
        .returning("*");
      return res
        .status(201)
        .json({ message: "Informações alteradas com sucesso", category });
    } catch (error) {
      const errorMessage = error.message;
      return res.status(400).json({
        message: "Ocorreu um erro ao alterar as informações",
        errorMessage,
      });
    }
  },

  async FindByDepartment(req, res) {
    const { id } = req.params;

    try {
      const categories = await knex("categories")
        .select("*")
        .where({ departments_id: id, active: true })
        .orderBy("name");
      return res.status(201).json(categories);
    } catch (error) {
      const errorMessage = error.message;
      return res.status(400).json({
        message: "Ocorreu um erro ao buscar as informações",
        errorMessage,
      });
    }
  },
};
