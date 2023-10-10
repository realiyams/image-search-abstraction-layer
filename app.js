var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const { format } = require('date-fns');
require('dotenv').config();

const Unsplash = require('unsplash-js').createApi;
const fetch = require('node-fetch');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
const db = require('./db');

const unsplash = new Unsplash({ accessKey: process.env.UNSPLASH_ACCESS_KEY, fetch: fetch });

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

function getFormattedTime() {
  return format(new Date(), "MMMM d yyyy, h:mm:ss a");
}

app.use('/', indexRouter);
// app.use('/users', usersRouter);

app.get('/query/:queryName', async (req, res) => {

  const query = req.params.queryName;
  const page = req.query.page || 1;

  try {
    const getPhotos = await unsplash.search.getPhotos({ query, page, perPage: 10 });
    const selectedKeyPhotos = getPhotos.response.results.map(item => {
      return {
        id: item.id,
        width: item.width,
        height: item.height,
        description: item.description,
        alt_description: item.alt_description,
        urls: item.urls,
        links: item.links
      }
    })

    const searchQuery = query;
    const timeSearched = getFormattedTime();

    const insertQuery = `
      INSERT INTO searches (searchQuery, timeSearched)
      VALUES (?, ?)
    `;

    db.run(insertQuery, [searchQuery, timeSearched], (err) => {
      if (err) {
        console.error('Error inserting data:', err.message);
      } else {
        console.log('Data inserted successfully');
      }
    });

    // db.close();

    res.json({ images: selectedKeyPhotos });
  } catch (error) {
    res.status(500).json({ error: 'Error in fetching image data' });
  }
});

app.get('/recent/', (req, res) => {
  db.serialize(() => {
    db.all('SELECT * FROM searches', (err, rows) => {
      if (err) {
        res.status(500).json({ error: 'Error reading data' });
        console.error('Error reading data:', err.message);
        return;
      }
      res.json(rows)
    });
  });

  // db.close();
})

module.exports = app;
