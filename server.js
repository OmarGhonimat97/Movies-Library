'use strict';

const express = require('express');
const cors = require('cors');
// const res = require('express/lib/response');
// const res = require('express');
require('dotenv').config();
const PORT = process.env.PORT
// const PORT = 3000;
// DATABASE_URL =postgress://omar:password:0000@localhost:5432/movies1
const bodyParser = require('body-parser');


const axios = require('axios').default;
const movieData = require('./Movie Data/data.json');
const app = express();
let apiKey = process.env.API_Key;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//app.use(express.json());
let DATABASE_URL = process.env.DATABASE_URL

const { Client } = require('pg');
const { query } = require('express');
const client = new Client({     
    connectionString: process.env.DATABASE_URL, 
        ssl: {       
              rejectUnauthorized: false  
               }
     })

// const client = new Client(DATABASE_URL);

app.use(cors());
// or app.get(*, error404Handler);
// app.use('/', error404Handler); 
// app.use('/', error500Handler);

// routes
app.post('/addMovie', postHandler);
app.get('/getMovies', getHandler);
app.put('/UPDATE/:movieID', updateHandler);
app.delete('/DELETE/:movieID', deleteHandler);
app.get('/getMovie/:movieID', getByIdHandler);
// app.use(handleError500);

//functions
// http://localhost:3000/addMovie
function postHandler(req, res) {
    console.log(req.body);

    let title = req.body.title;
    let rate = req.body.rate;
    let poster = req.body.poster;
    // let {title, rate, poster} = req.body; >> easier way (destructuring)

    let sql = `INSERT INTO movies (title, rate, poster) VALUES ($1,$2,$3) RETURNING *;`;
    let values = [title, rate, poster];

    client.query(sql, values).then(result => {
        console.log(result)
        return res.status(201).json(result.rows);

    }).catch(error => {
        res.send("error")
        })
}
// http://localhost:3000/getMovies
function getHandler(req, res) {
    let sql = `SELECT * FROM movies ;`;
    client.query(sql).then((result) => {
        console.log(result)
        res.json(result.rows);
    }).catch(error => {
        res.send("error");
    })
}

function updateHandler (req,res) {
    let id = req.params.movieID;
    let {title, rate, poster} = req.body;
    let sql = `UPDATE movies SET title=$1, rate=$2, poster=$3 WHERE id = ${id} RETURNING *`;
    let values = [title, rate, poster];
    client.query(sql, values).then(result => {
        console.log(result.rows[0]);
        res.json(result.rows[0]);
    }).catch()

}

function deleteHandler (req,res) {
    let id = req.params.movieID;
    let sql = `DELETE FROM movies WHERE id = ${id} RETURNING *`;
    client.query(sql).then(result => {
        console.log(result.rows[0]);
        res.status(204).json([]);
    }).catch(err => {
        console.log(err);
    })
}

function getByIdHandler (req,res) {
    let id = req.params.movieID;
    let sql = `SELECT * FROM movies WHERE id = ${id}`;
    client.query(sql).then((result) => {
        console.log(result)
        res.json(result.rows);
    }).catch(err => {
        console.log(err);
    })
}

// function handleError500(error, req, res) {
//     res.status(500).send(error);
// }


app.get('/', homePage);
app.get('/favorite', favoritePage);
app.get('/trending', trendingHandler);
app.get('/search', searchHandler);
app.get('/moviesTopRated', moviesTopRatedhandler);
app.get('/TVTopRated', TVTopRatedhandler);
app.get('*', error404Handler);



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
    res.status(error.status || 500).send({
        error: {
            status: error.status || 500,
            message: error.message || 'Internal Server Error',
        },
    });
});

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

function moviesTopRatedhandler(req, res) {

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

function TVseries(id, name, vote_average, origin_country) {
    this.id = id;
    this.name = name;
    this.vote_average = vote_average;
    this.origin_country = origin_country;
}

function TVTopRatedhandler(req, res) {

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

client.connect().then(() => {

    app.listen(PORT, () => {
        console.log(`Example app listening on PORT ${PORT}`)
    })

});