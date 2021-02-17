const knexkfile = require("../../knexfile");
const knex = require("knex")(knexkfile.development);

module.exports = knex;
