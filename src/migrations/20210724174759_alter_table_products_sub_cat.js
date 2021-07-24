exports.up = function (knex) {
  return knex.schema.alterTable("products", function (table) {
    table
      .integer("sub_cat_id")
      .references("subCat.id")
      .notNullable()
      .onDelete("CASCADE");
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable("products", function (table) {
    table.dropColumn("sub_cat_id");
  });
};
