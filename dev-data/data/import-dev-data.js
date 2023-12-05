const dotenv = require('dotenv');
const mongoose = require('mongoose');
const fs = require('fs');

const Tour = require('./../../models/tourModel');
dotenv.config({
  path: './../../config.env',
});

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
const DB_local = process.env.DATABASE_LOCAL;
mongoose
  .connect(DB_local, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((con) => {
    console.log('DB connect succesfsful!');
  });

// Read JSON -> Array
const tours = JSON.parse(fs.readFileSync('./tours-simple.json', 'utf-8'));
console.log(tours);

// Import data
const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('Data successfully loaded!');
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

// Delete all collections
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('Data successfully loaded!');
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

console.log(process.argv);

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
