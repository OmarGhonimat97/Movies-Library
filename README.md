# Movies-Library

# Movies - 1.0.0

**Author Name**: Omar Al Ghonimat

## WRRC
![WRRC](./assets/WRRC.PNG)

## WRRC-3rd Party API
![WRRC-API](./assets/WRRC-API.PNG)

## WRRC-Database
![WRRC-API](./assets/WRRC-DB.PNG)

## WRRC-Database-CRUD
![WRRC-API](./assets/WRRC-CRUD.PNG)

## Overview
preview movies with some information about them.

## Getting Started
1. require the package (express)
2. creat express app
3. make the server listen to a specific port (3000)
4. creat routes (endpoints)

## Project Features
- Home page >> Display the movie name and the poster path and an overview about the movie.
- Favorite page >>
Trending page >> shows the trending movies
- search >> enables the user to search for a movie title
- moviesTopRated >> show a lits of top rated movies
- TVTopRated >> show a lits of top rated TV series

## Database
- added /addMovie for the user to add a movie to database using 'post' method
- added /getMovies to get the information that was added to the database 
- added /UPDATE/:movieID, for the user to update the information by providing the id in the URL
- added /DELETE/:movieID, for deleting the information labeled with a certain id provided in the URL
- added /getMovie/:movieID, to get the information for a certain movie from the database by providing its id