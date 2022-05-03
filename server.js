'use strict';

const express = require('express');
const cors = require('cors');
// const res = require('express/lib/response');
// const res = require('express');
const port = 3000;
require('dotenv').config()

const axios = require('axios').default;
const movieData = require('./Movie Data/data.json');
const app = express();
// let apiKey = process.env.API_Key ;
let apiKey = 'd7110c209df36274700f1e0f5f79e176';

app.use(cors());
// or app.get(*, error404Handler)
// app.use('/', error404Handler); 
// app.use('/', error500Handler);


app.get('/', homePage);
app.get('/favorite', favoritePage);
app.get('/trending', trendingHandler);
app.get('/search', searchHandler);
app.get('/moviesTopRated', moviesTopRatedhandler);
app.get ('/TVTopRated', TVTopRatedhandler);
app.get('*', error404Handler);


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

function homePage(req, res) {
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

function favoritePage(req, res) {
    res.send('Welcome to Favorite Page');
    console.log(apiKey);
}

function Movie(id, title, release_date, vote_average, posterPath, overview) {
    this.id = id;
    this.title = title;
    this.release_date = release_date;
    this.vote_average = vote_average;
    this.posterPath = posterPath;
    this.overview = overview;
}

function error404Handler(req, res) {
    res.type('text/plain');
    res.status(404).send('404 page not found');
}

// error handler 500
app.use((error, req, res, next) => {
    console.error(error.stack);
    res.status(500).send('Something Broke!');
   })
// function error500Handler (req,res) {
//     res.type('text/plain');
//     res.status(500);
//     res.send('Sorry, something went wrong')  
// }
// https://api.themoviedb.org/3/trending/all/week?api_key=${API_Key}
// https://api.themoviedb.org/3/trending/all/week?api_key=${API_Key}&language=en-US


function trendingHandler(req, res) {
    let url = `https://api.themoviedb.org/3/trending/all/week?api_key=${apiKey}&language=en-US`;
    axios.get(url)
        .then(data => {

        // console.log(data.data.results);
        let mInfo = data.data.results.map((movie) => {
            return new Movie(
                movie.id,
                movie.title,
                movie.release_date,
                movie.poster_path,
                movie.overview
            );
        });
console.log(mInfo);
            res.json(mInfo);
        }

        )
        .catch((error => {
            console.log('error in getting data from API')
            res.send('error in getting data from API')
        }))

}

// https://api.themoviedb.org/3/search/movie?api_key=${API_Key}&language=en-US&query=The&page=2
// http://localhost:3000/search?name=
// http://localhost:3000/search?name=...&secName=...

function searchHandler(req, res) {

  let movieName = req.query.name;
  let pageNumber = req.query.page;
    let url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=en-US&query=${movieName}&page=${pageNumber}`;
    axios.get(url)
        .then(data => {

       
            res.json(data.data.results);
        }

        )
        .catch((error => {
            console.log('error in getting data from API')
            res.send('error in getting data from API')
        }))

}

function moviesTopRatedhandler (req, res) {

  let url = `https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}&language=en-US&page=1`;
    axios.get(url)
        .then(data => {

        // console.log(data.data.results);
        let moviesInfo = data.data.results.map((series) => {
            return new Movie(
                series.id,
                series.title,
                series.release_date,
                series.vote_average,
            );
        });
console.log(moviesInfo);
            res.json(moviesInfo);
        }

        )
        .catch((error => {
            console.log('error in getting data from API')
            res.send('error in getting data from API')
        }))

}

function TVseries (id, name, vote_average, origin_country) {
  this.id = id;
  this.name = name;
  this.vote_average = vote_average;
  this.origin_country = origin_country;
}

function TVTopRatedhandler (req, res) {

  let url = `https://api.themoviedb.org/3/tv/top_rated?api_key=${apiKey}&language=en-US&page=1`;
    axios.get(url)
        .then(data => {

        // console.log(data.data.results);
        let seriesInfo = data.data.results.map((series) => {
            return new TVseries(
                series.id,
                series.name,
                series.vote_average,
                series.origin_country,
            );
        });
console.log(seriesInfo);
            res.json(seriesInfo);
        }

        )
        .catch((error => {
            console.log('error in getting data from API')
            res.send('error in getting data from API')
        }))

}