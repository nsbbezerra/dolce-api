exports.up = function (knex) {
  return knex.schema.createTable("payForm", function (table) {
    table.increments("id");
    table.string("name").notNullable();
    table
      .integer("bank_id")
      .references("bankAccount.id")
      .notNullable()
      .onDelete("CASCADE");
    table.integer("max_portion");
    table.integer("interval_days");
    table.enu("status", ["parceled_out", "in_cash"]).notNullable();
    table
      .enu("type", [
        "money",
        "ticket",
        "credit",
        "debit",
        "promissory",
        "transfer",
        "check",
      ])
      .notNullable();
    table.boolean("show_on_site").notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("payForm");
};
