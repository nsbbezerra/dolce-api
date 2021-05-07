exports.up = function (knex) {
  return knex.schema.createTable("departments", function (table) {
    table.increments("id");
    table.string("name").notNullable();
    table.string("description");
    table.boolean("active").notNullable().defaultTo(true);
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("departments");
};
