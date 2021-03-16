exports.up = function (knex) {
  return knex.schema.createTable("checks", function (table) {
    table.increments("id");
    table
      .integer("client_id")
      .references("clients.id")
      .notNullable()
      .onDelete("CASCADE");
    table.string("number").notNullable();
    table.string("entity");
    table.enu("situation", ["okay", "waiting", "refused"]).notNullable();
    table.enu("status", ["parceled_out", "in_cash"]).notNullable();
    table.decimal("value", 8, 2);
    table.date("emission");
    table.date("due_date");
    table.string("observation");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("checks");
};
