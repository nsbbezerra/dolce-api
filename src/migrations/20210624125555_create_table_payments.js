exports.up = function (knex) {
  return knex.schema.createTable("payments", function (table) {
    table.increments("id");
    table
      .integer("order_id")
      .references("orders.id")
      .notNullable()
      .onDelete("CASCADE");
    table
      .integer("cashier_id")
      .references("cashier.id")
      .notNullable()
      .onDelete("CASCADE");
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
    table.decimal("value", 8, 2);
    table.date("date_mov");
    table.date("due_date");
    table.string("month").notNullable();
    table.string("year").notNullable();
    table.enu("status", ["waiting", "canceled", "paid_out"]);
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("payments");
};
