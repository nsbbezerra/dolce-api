exports.up = function (knex) {
  return knex.schema.alterTable("providers", function (table) {
    table.string("fantasia");
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable("providers", function (table) {
    table.dropColumn("fantasia");
  });
};
