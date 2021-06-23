exports.up = function (knex) {
  return knex.schema.createTable("orders", function (table) {
    table.increments("id");
    table
      .integer("client_id")
      .references("clients.id")
      .notNullable()
      .onDelete("CASCADE");
    table
      .integer("employee_id")
      .references("employees.id")
      .notNullable()
      .onDelete("CASCADE");
    table.enu("from", ["site", "shop"]).notNullable();
    table.json("payment_info");
    table.json("products");
    table
      .enu("status_order_site", [
        "awaiting_payment",
        "preSale",
        "payment_confirmed",
        "in_separation",
        "unavailability",
        "packed",
        "sent",
        "returned",
        "canceled",
      ])
      .notNullable()
      .defaultTo("awaitingPayment");
    table
      .enu("status_order_shop", [
        "budget",
        "billed",
        "completed",
        "returned",
        "canceled",
      ])
      .notNullable();
    table.decimal("grand_total", 8, 2);
    table.decimal("discount", 8, 2);
    table.decimal("total_to_pay", 8, 2);
    table.date("order_date");
    table.string("tracking_code");
    table.enu("tracking_mode", [
      "delivery",
      "withdrawal",
      "correios",
      "shipping_company",
    ]);
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("orders");
};
