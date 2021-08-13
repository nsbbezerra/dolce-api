exports.up = function (knex) {
  return knex.schema.alterTable("cashierMov", function (table) {
    table
      .integer("cashier_id")
      .references("cashier.id")
      .notNullable()
      .onDelete("CASCADE");
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable("cashierMov", function (table) {
    table.dropColumn("cashier_id");
  });
};
