require("dotenv").config();

module.exports = {
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT, 10) || 5432,
  username: process.env.DB_USERNAME || "postgres",
  password: process.env.DB_PASSWORD || "1234",
  database: process.env.DB_DATABASE || "performance-management",
  entities: ["dist/**/*.entity{.ts,.js}"],
  migrations: ["dist/migrations/*{.ts,.js}"],
  cli: {
    migrationsDir: "src/migrations",
  },
};
