exports.up = function (knex) {
  return knex.schema.alterTable("products", function (table) {
    table.integer("tag_id");
    table.string("tag_name");
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable("products", function (table) {
    table.dropColumn("tag_id");
    table.dropColumn("tag_name");
  });
};
