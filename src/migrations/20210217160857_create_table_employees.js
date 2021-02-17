exports.up = function (knex) {
  return knex.schema.createTable("employees", function (table) {
    table.increments("id");
    table.string("name").notNullable();
    table.enu("gender", ["masc", "fem"]).notNullable();
    table.string("contact").notNullable();
    table.string("user").unique().notNullable();
    table.string("password").notNullable();
    table.string("token");
    table.string("premission").notNullable().defaultTo("shop");
    table.boolean("active").notNullable().defaultTo(true);
    table.boolean("admin").notNullable();
    table.boolean("sales").notNullable();
    table.boolean("caixa").notNullable();
    table.decimal("comission", 8, 2).notNullable();
    table.boolean("comissioned").notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("employees");
};
