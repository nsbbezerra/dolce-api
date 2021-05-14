exports.up = function (knex) {
  return knex.schema.createTable("pix", function (table) {
    table.increments("id");
    table
      .enu("type", ["cpf", "cnpj", "phone", "email", "aleatory"])
      .notNullable();
    table.string("value").notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("pix");
};
