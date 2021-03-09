exports.up = function (knex) {
  return knex.schema.createTable("bankAccount", function (table) {
    table.increments("id");
    table.string("bank").notNullable();
    table.enu("mode", ["current", "savings"]).notNullable();
    table.string("agency").notNullable();
    table.string("account").notNullable();
    table.string("variation");
    table.string("operation");
    table.string("thumbnail");
    table.string("blobName");
    table.decimal("amount", 8, 2).notNullable();
    table.boolean("active").notNullable().defaultTo(true);
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("bankAccount");
};
