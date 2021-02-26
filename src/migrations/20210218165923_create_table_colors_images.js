exports.up = function (knex) {
  return knex.schema.createTable("colorsImages", function (table) {
    table.increments("id");
    table
      .integer("products_id")
      .references("products.id")
      .notNullable()
      .onDelete("CASCADE");
    table
      .integer("colors_id")
      .references("colors.id")
      .notNullable()
      .onDelete("CASCADE");
    table.string("name").notNullable();
    table.string("hex").notNullable();
    table.string("image").notNullable();
    table.string("blobName");
    table.boolean("active").notNullable().defaultTo(true);
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("colorsImages");
};
