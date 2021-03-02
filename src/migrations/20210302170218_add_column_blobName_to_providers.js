exports.up = function (knex) {
  return knex.schema.alterTable("providers", function (table) {
    table.string("blobName");
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable("providers", function (table) {
    table.dropColumn("blobName");
  });
};
