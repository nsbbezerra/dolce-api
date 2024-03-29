// Update with your config settings.
const path = require("path");

module.exports = {
  development: {
    client: "pg",
    connection: {
      database: "nkgest",
      user: "postgres",
      password: "03102190",
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
