const knex = require("../../../database/pg");

module.exports = {
  async Store(req, res) {
    const { name, categories_id, description } = req.body;

    try {
      const cat = await knex("subCat").where({ categories_id, name }).first();

      if (cat) {
        return res
          .status(400)
          .json({ message: "Esta Sub-Categoria já está cadastrada" });
      }

      await knex("subCat").insert({ name, categories_id, description });

      return res
        .status(201)
        .json({ message: "Sub-Categoria cadastrada com sucesso" });
    } catch (error) {
      const errorMessage = error.message;
      return res.status(400).json({
        message: "Ocorreu um erro ao cadastrar a Sub-Categoria",
        errorMessage,
      });
    }
  },

  async Find(req, res) {
    const { category } = req.params;

    try {
      const sub_cat = await knex
        .select("*")
        .from("subCat")
        .where({ categories_id: category, active: true })
        .orderBy("name");

      return res.status(201).json(sub_cat);
    } catch (error) {
      const errorMessage = error.message;
      return res.status(400).json({
        message: "Ocorreu um erro ao buscar as informações",
        errorMessage,
      });
    }
  },

  async Show(req, res) {
    try {
      const sub_cat = await knex
        .select([
          "subCat.name",
          "subCat.id",
          "subCat.active",
          "subCat.description",
          "categories.id as category_id",
          "categories.name as category_name",
        ])
        .from("subCat")
        .innerJoin("categories", "categories.id", "subCat.categories_id")
        .orderBy("subCat.name");
      return res.status(201).json(sub_cat);
    } catch (error) {
      const errorMessage = error.message;
      return res.status(400).json({
        message: "Ocorreu um erro ao buscar as informações",
        errorMessage,
      });
    }
  },

  async ShowWithPagination(req, res) {
    const { page, text } = req.params;
    const pageInt = parseInt(page);

    try {
      if (text === "All") {
        const sub_cat = await knex
          .select([
            "subCat.name",
            "subCat.id",
            "subCat.active",
            "subCat.description",
            "categories.id as category_id",
            "categories.name as category_name",
          ])
          .from("subCat")
          .innerJoin("categories", "categories.id", "subCat.categories_id")
          .orderBy("subCat.name")
          .limit(10)
          .offset((pageInt - 1) * 10);
        const [count] = await knex("subCat").count();
        return res.status(201).json({ sub_cat, count });
      } else {
        const sub_cat = await knex
          .select([
            "subCat.name",
            "subCat.id",
            "subCat.active",
            "subCat.description",
            "categories.id as category_id",
            "categories.name as category_name",
          ])
          .from("subCat")
          .where("subCat.name", "like", `%${text}%`)
          .innerJoin("categories", "categories.id", "subCat.categories_id")
          .orderBy("subCat.name")
          .limit(10)
          .offset((pageInt - 1) * 10);
        const [count] = await knex("subCat")
          .where("subCat.name", "like", `%${text}%`)
          .count();
        return res.status(201).json({ sub_cat, count });
      }
    } catch (error) {
      const errorMessage = error.message;
      return res.status(400).json({
        message: "Ocorreu um erro ao buscar as informações",
        errorMessage,
      });
    }
  },

  async Active(req, res) {
    const { id } = req.params;
    const { active } = req.body;

    try {
      const sub_cat = await knex("subCat")
        .where({ id: id })
        .update({ active })
        .returning("*");

      return res
        .status(201)
        .json({ message: "Informação alterada com sucesso", sub_cat });
    } catch (error) {
      const errorMessage = error.message;
      return res.status(400).json({
        message: "Ocorreu um erro ao alterar as informações",
        errorMessage,
      });
    }
  },

  async Edit(req, res) {
    const { id } = req.params;
    const { name, description } = req.body;

    try {
      const subCat = await knex("subCat")
        .where({ id: id })
        .update({ name, description })
        .returning("*");

      return res
        .status(201)
        .json({ message: "Informações alteradas com sucesso", subCat });
    } catch (error) {
      const errorMessage = error.message;
      return res.status(400).json({
        message: "Ocorreu um erro ao editar as informações",
        errorMessage,
      });
    }
  },
};
