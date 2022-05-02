'use strict';

const express = require('express');
const res = require('express/lib/response');
const app = express()
const port = 3000
const movieData = require('./Movie Data/data.json');

app.get('/', homePage);
app.get ('/favorite', favoritePage);
app.get('*', error404Handler);

// app.use('/', error404Handler);
app.use('/', error500Handler);

app.use((error, req, res, next) => {
    res.status(error.status || 500).send({
      error: {
        status: error.status || 500,
        message: error.message || 'Internal Server Error',
      },
    });
  });

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

function homePage (req, res) {
let info = [];

movieData.data.forEach(element => {

    let newMovie = new Movie(
        element.title,
        element.poster_path,
        element.overview
    );
    info.push(newMovie);
});
console.log(info);
res.json(info);
}

function favoritePage (req, res) {
res.send('Welcome to Favorite Page');
}

function Movie (title, posterPath, overview) {
    this.title = title;
    this.posterPath = posterPath;
    this.overview = overview;
}

function error404Handler (req,res) {
    res.type('text/plain');
    res.status(404);
    res.send('404 page not found')  
}

function error500Handler (req,res) {
    res.type('text/plain');
    res.status(500);
    res.send('Sorry, something went wrong')  
}

