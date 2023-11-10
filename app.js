const DEBUG = true;

//set up the server
const express = require( "express" );
const app = express();
const port = 3100;
const db = require('./db/db_connection');

// // Configure Express to use EJS
// app.set( "views",  __dirname + "/views");
// app.set( "view engine", "ejs" );

//middleware
const logger = require("morgan");
app.use(logger("dev"));

// define middleware that serves static resources in the public directory
app.use(express.static(__dirname + '/public'));

// define a route for the default home page
app.get( "/", ( req, res ) => {
    res.render('index');
    //res.sendFile( __dirname + "/views/index.html" );
} );

// define a route for the empowering page
app.get( "/empowering", ( req, res ) => {
    res.sendFile( __dirname + "/views/empowering.html" );
} );

// // define a route for the assignment list page
// const read_empowering_all_sql = `
//     SELECT 
//         quoteId, quoteName, author themeName, 
//         quotes.themeId as themeId,
//     FROM quotes
//     JOIN themes
//         ON quotes.themeId = themes.themeId
//     ORDER BY quotes.quoteId DESC
// `
// app.get( "/empowering", ( req, res ) => {
//     db.execute(read_empowering_all_sql, (error, results) => {
//         if (DEBUG)
//             console.log(error ? error : results);
//         if (error)
//             res.status(500).send(error); //Internal Server Error
//         else
//             res.send(results);
//     });
// });

// define a route for the liked quotes list page
app.get( "/likedquotes", ( req, res ) => {
    res.sendFile( __dirname + "/views/likedquotes.html" );
} );

// // define a route for the assignment detail page
// app.get( "/assignments/detail", ( req, res ) => {
//     res.send( "<h1>This is the 2 assignment detail page.</h1>" );
// } );

// start the server
app.listen( port, () => {
    console.log(`App server listening on ${ port }. (Go to http://localhost:${ port })` );
} );