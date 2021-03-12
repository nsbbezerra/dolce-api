exports.up = function (knex) {
  return knex.schema.createTable("planAccounts", function (table) {
    table.increments("id");
    table.string("plan").notNullable();
    table.string("name").notNullable();
    table.enu("mode", ["debit", "credit"]).notNullable();
    table.boolean("active").notNullable().defaultTo(true);
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("planAccounts");
};
