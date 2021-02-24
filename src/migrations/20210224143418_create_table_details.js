exports.up = function (knex) {
  return knex.schema.createTable("details", function (table) {
    table.increments("id");
    table
      .integer("products_id")
      .references("products.id")
      .notNullable()
      .onDelete("CASCADE");
    table.string("description").notNullable();
    table.json("list");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("details");
};
