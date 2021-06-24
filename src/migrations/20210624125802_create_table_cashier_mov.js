exports.up = function (knex) {
  return knex.schema.createTable("cashierMov", function (table) {
    table.increments("id");
    table.string("identify").notNullable();
    table.string("description");
    table.decimal("value", 8, 2);
    table.enu("status", ["approved", "canceled", "waiting"]);
    table.enu("authorization", ["approved", "canceled", "waiting"]);
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("cashierMov");
};
