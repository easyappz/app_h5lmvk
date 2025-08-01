/** Не редактируй вообще код этого файла, импортируй в необходимые файлы mongoDb и используй его. */
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI;

const mongoDb = mongoose.createConnection(MONGO_URI);

mongoDb
  .asPromise()
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

module.exports = {
  mongoDb,
};
