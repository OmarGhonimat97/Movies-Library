'use strict';

const express = require('express');
const cors = require('cors');
// const res = require('express/lib/response');
// const res = require('express');
const port = 3000;

const axios = require('axios').default;
const movieData = require('./Movie Data/data.json');
const app = express();

app.use(cors());
// or app.get(*, error404Handler)
// app.use('/', error404Handler); 
// app.use('/', error500Handler);

// app.get('*', error404Handler);
app.get('/', homePage);
app.get('/favorite', favoritePage);
app.get('/tredning', trendingHandler);
app.get('/search', searchHandler);


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
}

function Movie(title, posterPath, overview) {
    this.title = title;
    this.posterPath = posterPath;
    this.overview = overview;
}

// function error404Handler(req, res) {
//     res.type('text/plain');
//     res.status(404);
//     res.send('404 page not found')
// }

// function error500Handler (req,res) {
//     res.type('text/plain');
//     res.status(500);
//     res.send('Sorry, something went wrong')  
// }
// https://api.themoviedb.org/3/trending/all/week?api_key=d7110c209df36274700f1e0f5f79e176

function trendingHandler(req, res) {
    let url = 'https://api.themoviedb.org/3/trending/all/week?api_key=d7110c209df36274700f1e0f5f79e176';
    axios.get(url)
        .then(data => {

        // console.log(data.page.results);
        let mInfo = data.page.results.map((movie) => {
            return new Movie(
                movie.title,
                movie.poster_path,
                movie.overview
            );
        });

            res.json(mInfo);
        }

        )
        .catch((error => {
            console.log('error in getting data from API')
            res.send('error in getting data from API')
        }))

}

// https://api.themoviedb.org/3/search/movie?api_key=668baa4bb128a32b82fe0c15b21dd699&language=en-US&query=The&page=2

function searcjHandler(req, res) {
    let url = 'https://api.themoviedb.org/3/search/movie?api_key=668baa4bb128a32b82fe0c15b21dd699&language=en-US&query=The&page=2';
    axios.get(url)
        .then(data => {

        // console.log(data.page.results);
        let mInfo = data.page.results.map((movie) => {
            return new Movie(
                movie.title,
                movie.poster_path,
                movie.overview
            );
        });

            res.json(mInfo);
        }

        )
        .catch((error => {
            console.log('error in getting data from API')
            res.send('error in getting data from API')
        }))

}