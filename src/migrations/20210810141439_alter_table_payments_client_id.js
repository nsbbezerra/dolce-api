exports.up = function (knex) {
  return knex.schema.alterTable("payments", function (table) {
    table
      .integer("client_id")
      .references("clients.id")
      .notNullable()
      .onDelete("CASCADE");
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable("payments", function (table) {
    table.dropColumn("client_id");
  });
};
