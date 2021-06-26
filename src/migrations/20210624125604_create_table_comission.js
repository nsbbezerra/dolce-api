exports.up = function (knex) {
  return knex.schema.createTable("commission", function (table) {
    table.increments("id");
    table
      .integer("employee_id")
      .references("employees.id")
      .notNullable()
      .onDelete("CASCADE");
    table
      .integer("order_id")
      .references("orders.id")
      .notNullable()
      .onDelete("CASCADE");
    table.decimal("value", 8, 2);
    table.string("month").notNullable();
    table.string("year").notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("commission");
};
