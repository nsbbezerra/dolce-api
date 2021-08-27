exports.up = function (knex) {
  return knex.schema.createTable("xmlimporter", function (table) {
    table.increments("id");
    table.string("nfe_key");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("xmlimporter");
};
