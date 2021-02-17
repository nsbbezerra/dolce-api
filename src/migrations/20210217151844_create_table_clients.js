exports.up = function (knex) {
  return knex.schema.createTable("clients", function (table) {
    table.increments("id");
    table.string("name").notNullable();
    table.enu("gender", ["masc", "fem"]).notNullable();
    table.string("cpf").notNullable().unique();
    table.string("email").unique();
    table.string("user").unique().notNullable();
    table.string("password").notNullable();
    table.string("contact").notNullable();
    table.boolean("active").notNullable().defaultTo(true);
    table.boolean("restrict").notNullable().defaultTo(false);
    table.string("token");
    table.string("passwordResetToken");
    table.string("passwordResetExpires");
    table.string("premission").notNullable().defaultTo("site");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("clients");
};
