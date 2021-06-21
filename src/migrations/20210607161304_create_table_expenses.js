exports.up = function (knex) {
  return knex.schema.createTable("expenses", function (table) {
    table.increments("id");
    table
      .integer("payForm_id")
      .references("payForm.id")
      .notNullable()
      .onDelete("CASCADE");
    table
      .integer("planAccounts_id")
      .references("planAccounts.id")
      .notNullable()
      .onDelete("CASCADE");
    table.string("identify").notNullable();
    table.date("due_date");
    table.decimal("value", 8, 2);
    table.enu("status", ["cancel", "waiting", "done"]).notNullable();
    table.enu("movimentation", ["cancel", "waiting", "done"]).notNullable();
    table.string("description");
    table.string("month").notNullable();
    table.string("year").notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("expenses");
};
