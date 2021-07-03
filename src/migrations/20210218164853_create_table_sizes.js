exports.up = function (knex) {
  return knex.schema.createTable("sizes", function (table) {
    table.increments("id");
    table
      .integer("products_id")
      .references("products.id")
      .notNullable()
      .onDelete("CASCADE");
    table.string("size").notNullable();
    table.integer("amount").notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("sizes");
};
