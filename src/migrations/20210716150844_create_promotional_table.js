exports.up = function (knex) {
  return knex.schema.createTable("tags", function (table) {
    table.increments("id");
    table.boolean("active").defaultTo(true).notNullable();
    table.string("name").notNullable();
    table.decimal("discount", 8, 2).notNullable();
    table.string("banner");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("tags");
};
