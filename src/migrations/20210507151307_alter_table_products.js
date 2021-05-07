exports.up = function (knex) {
  return knex.schema.alterTable("products", function (table) {
    table
      .integer("providers_id")
      .references("providers.id")
      .notNullable()
      .onDelete("CASCADE");
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable("products", function (table) {
    table.dropColumn("providers_id");
  });
};
