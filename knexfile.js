// Update with your config settings.
const path = require("path");

module.exports = {
  development: {
    client: "pg",
    connection: {
      database: "nkgest",
      user: "nkinfo",
      password: "natan210290",
    },
    migrations: {
      tableName: "knex_migrations",
      directory: `${path.resolve(__dirname, "src", "migrations")}`,
    },
    seeds: {
      directory: `${path.resolve(__dirname, "src", "seeds")}`,
    },
  },
};
