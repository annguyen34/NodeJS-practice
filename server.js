const app = require('./app');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config({
  path: './config.env',
});

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
const DB_local = process.env.DATABASE_LOCAL;

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((con) => {
    console.log('DB connect succesfsful!');
  });

// Start server
const port = process.env.PORT || 8000;
const server = app.listen(port, () => {
  console.log(`App running at port ${port}`);
});

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('Unhandled rejection, shutting down...');
  server.close(() => process.exit(1));
});

process.on('uncaughtException', () => {
  console.log(err.name, err.message);
  console.log('Uncaught Exception, shutting down...');
  server.close(() => {
    process.exit(1);
  });
});
