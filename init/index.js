const mongoose = require('mongoose');
const initData = require('./data.js');
const Listing = require('../models/listing.js');

const dbUrl = process.env.ATLAS_URL;

async function main() {
  try {
    await mongoose.connect(dbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Connected to the DB");

    await initDB();

    mongoose.connection.close();
    console.log("Connection closed");
  } catch (err) {
    console.error("Error connecting to the DB:", err);
  }
}

async function initDB() {
  try {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({
      ...obj,
      owner: "6593bfe3936930fe4089f454",
    }));
    await Listing.insertMany(initData.data);
    console.log("Data is Initialized Successfully");
  } catch (err) {
    console.error("Error initializing the database:", err);
  }
}

main();
