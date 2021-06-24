exports.up = function (knex) {
  return knex.schema.createTable("cashier", function (table) {
    table.increments("id");
    table
      .integer("employee_id")
      .references("employees.id")
      .notNullable()
      .onDelete("CASCADE");
    table.decimal("open_value", 8, 2);
    table.decimal("close_value", 8, 2);
    table
      .enu("status", ["open", "freeze", "close"])
      .notNullable()
      .defaultTo("open");
    table.date("open_date");
    table.date("close_date");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("cashier");
};
