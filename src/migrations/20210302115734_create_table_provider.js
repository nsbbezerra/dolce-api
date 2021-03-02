exports.up = function (knex) {
  return knex.schema.createTable("providers", function (table) {
    table.increments("id");
    table.string("name").notNullable();
    table.string("cnpj").notNullable();
    table.string("contact").notNullable();
    table.string("email").notNullable();
    table.string("street").notNullable();
    table.string("number").notNullable();
    table.string("comp");
    table.string("district").notNullable();
    table.string("city").notNullable();
    table.string("cep").notNullable();
    table.string("state").notNullable();
    table.string("thumbnail");
    table.boolean("active").notNullable().defaultTo(true);
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("providers");
};
