require("dotenv").config();

module.exports = {
  type: "postgres",
  url: process.env.DATABASE_URL,
  entities: ["dist/**/*.entity{.ts,.js}"],
  migrations: ["dist/migrations/*{.ts,.js}"],
  cli: {
    migrationsDir: "src/migrations",
  },
  ssl: {
    rejectUnauthorized: false // Required for some cloud database providers
  }
};
