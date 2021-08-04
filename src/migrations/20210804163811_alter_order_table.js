exports.up = function (knex) {
  return knex.schema.alterTable("orders", function (table) {
    table.enu("waiting", ["none", "yes", "cancel"]);
    table.string("month");
    table.string("year");
    table.string("obs");
    table.enu("fiscal", ["nfe", "nfce"]);
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable("orders", function (table) {
    table.dropColumn("waiting");
    table.dropColumn("month");
    table.dropColumn("year");
    table.dropColumn("obs");
    table.dropColumn("fiscal");
  });
};
