exports.up = function (knex) {
  return knex.schema.createTable("addresses", function (table) {
    table.increments("id");
    table
      .integer("client_id")
      .references("clients.id")
      .notNullable()
      .onDelete("CASCADE");
    table.string("street").notNullable();
    table.string("number").notNullable();
    table.string("comp");
    table.string("bairro").notNullable();
    table.string("cep").notNullable();
    table.string("city").notNullable();
    table.string("state").notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("addresses");
};
