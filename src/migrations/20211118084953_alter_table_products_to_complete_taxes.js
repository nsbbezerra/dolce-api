exports.up = function (knex) {
  return knex.schema.alterTable("products", function (table) {
    table.decimal("icms_base_calc", 8, 2);
    table.decimal("imcs_st_base_calc", 8, 2);
    table.decimal("fcp_base_calc", 8, 2);
    table.decimal("fcp_st_base_calc", 8, 2);
    table.decimal("pis_base_calc", 8, 2);
    table.decimal("cofins_base_calc", 8, 2);
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable("products", function (table) {
    table.dropColumn("freight_format");
    table.dropColumn("icms_base_calc");
    table.dropColumn("imcs_st_base_calc");
    table.dropColumn("fcp_base_calc");
    table.dropColumn("fcp_st_base_calc");
    table.dropColumn("pis_base_calc");
    table.dropColumn("cofins_base_calc");
  });
};
