exports.up = function (knex) {
  return knex.schema.createTable("tempProducts", function (table) {
    table.increments("id");
    table.string("identify");
    table
      .integer("providers_id")
      .references("providers.id")
      .notNullable()
      .onDelete("CASCADE");
    table
      .integer("xml_id")
      .references("xmlimporter.id")
      .notNullable()
      .onDelete("CASCADE");
    table.string("provider_code");
    table.string("name").notNullable();
    table.string("description").notNullable();
    table.string("sku");
    table.string("barcode");
    table.decimal("rating", 8, 2);
    table.boolean("active").notNullable().defaultTo(true);
    table.boolean("actualized");
    table.boolean("disponible").notNullable().defaultTo(true);
    table.integer("sale_count");
    table.string("cfop");
    table.string("ncm");
    table.decimal("icms_rate", 8, 2);
    table.string("icms_origin");
    table.string("icms_csosn");
    table.decimal("icms_st_rate", 8, 2);
    table.decimal("icms_marg_val_agregate", 8, 2);
    table.string("icms_st_mod_bc");
    table.decimal("fcp_rate", 8, 2);
    table.decimal("fcp_st_rate", 8, 2);
    table.decimal("fcp_ret_rate", 8, 2);
    table.string("ipi_cst");
    table.decimal("ipi_rate", 8, 2);
    table.string("ipi_code");
    table.string("pis_cst");
    table.decimal("pis_rate", 8, 2);
    table.string("cofins_cst");
    table.decimal("cofins_rate", 8, 2);
    table.string("cest");
    table.decimal("cost_value", 8, 2);
    table.decimal("other_cost", 8, 2);
    table.decimal("icms_base_calc", 8, 2);
    table.decimal("imcs_st_base_calc", 8, 2);
    table.decimal("fcp_base_calc", 8, 2);
    table.decimal("fcp_st_base_calc", 8, 2);
    table.decimal("ipi_base_calc", 8, 2);
    table.decimal("pis_base_calc", 8, 2);
    table.decimal("cofins_base_calc", 8, 2);
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("tempProducts");
};
