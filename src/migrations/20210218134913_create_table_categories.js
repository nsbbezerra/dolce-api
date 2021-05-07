exports.up = function (knex) {
  return knex.schema.createTable("categories", function (table) {
    table.increments("id");
    table
      .integer("departments_id")
      .references("departments.id")
      .notNullable()
      .onDelete("CASCADE");
    table.string("name").notNullable();
    table.string("description").notNullable();
    table.boolean("active").notNullable().defaultTo(true);
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("categories");
};
