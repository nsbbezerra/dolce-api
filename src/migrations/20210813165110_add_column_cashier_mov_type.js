exports.up = function (knex) {
  return knex.schema.alterTable("cashierMov", function (table) {
    table.enu("type", ["deposit", "withdraw"]);
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable("cashierMov", function (table) {
    table.dropColumn("type");
  });
};
