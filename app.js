const DEBUG = true;

//set up the server
const express = require( "express" );
const app = express();
const port = 3100;
const db = require('./db/db_connection');

// Configure Express to use EJS
app.set( "views",  __dirname + "/views");
app.set( "view engine", "ejs" );

//middleware
const logger = require("morgan");
app.use(logger("dev"));

// Configure Express to parse URL-encoded POST request bodies (forms)
app.use( express.urlencoded({ extended: false }) );

// define middleware that serves static resources in the public directory
app.use(express.static(__dirname + '/public'));

// define a route for the default home page
app.get( "/", ( req, res ) => {
    res.render('index');
    //res.sendFile( __dirname + "/views/index.html" );
} );

// // define a route for the empowering page
// app.get( "/empowering", ( req, res ) => {
//     res.sendFile( __dirname + "/views/empowering.html" );
// } );

// define a route for the quote list page
const read_empowering_all_sql = `
    SELECT 
        quoteId, quoteName, author, themeName, 
        quotes.themeId as themeId
    FROM quotes
    JOIN themes
        ON quotes.themeId = themes.themeId
    ORDER BY quotes.quoteId DESC
`
app.get( "/empowering", ( req, res ) => {
    db.execute(read_empowering_all_sql, (error, results) => {
        if (DEBUG)
            console.log(error ? error : results);
        if (error)
            res.status(500).send(error); //Internal Server Error
        else {
            let data = { qlist : results };
            res.render('empowering', data);
        }
    });
});

// define a route for the liked quotes list page
app.get( "/likedquotes", ( req, res ) => {
    res.sendFile( __dirname + "/views/likedquotes.html" );
} );

// define a route for the quote detail page
const read_empowering_detail_sql = `
    SELECT
        quoteId, quoteName, author, themeName,
        quotes.themeId as themeId
    FROM quotes
    JOIN themes
        ON quotes.themeId = themes.themeId
    WHERE quoteId = ?
`
app.get( "/empowering/:id", ( req, res ) => {
    db.execute(read_empowering_detail_sql, [req.params.id], (error, results) => {
        if (DEBUG)
            console.log(error ? error : results);
        if (error)
            res.status(500).send(error); //Internal Server Error
        else if (results.length == 0)
            res.status(404).send(`No quote found with id = "${req.params.id}"` ); // NOT FOUND
        else {
            let data = {qdetail: results[0]}; // results is still an array, get first (only) element
            res.render('detail', data); 
            // What's passed to the rendered view: 
            //  hw: {quoteId: ___ , quoteName: ___ , author: ___ , 
            //    themeName: ___ 
            //  }
        }
    });
});

// define a route for quote DELETE
const delete_quote_sql = `
    DELETE 
    FROM
        quotes
    WHERE
        quoteId = ?
`
app.get("/empowering/:id/delete", ( req, res ) => {
    db.execute(delete_quote_sql, [req.params.id], (error, results) => {
        if (DEBUG)
            console.log(error ? error : results);
        if (error)
            res.status(500).send(error); //Internal Server Error
        else {
            res.redirect("/empowering");
        }
    });
});

// define a route for quote CREATE
const create_quote_sql = `
    INSERT INTO quotes 
        (quoteName, author, themeName) 
    VALUES 
        (?, ?, ?);
`
app.post("/empowering", ( req, res ) => {
    console.log("hi");
    db.execute(create_quote_sql, [req.body.quoteName, req.body.author, req.body.themeName], (error, results) => {
        if (DEBUG)
            console.log(error ? error : results);
        if (error)
            res.status(500).send(error); //Internal Server Error
        else {
            //results.insertId has the primary key (quoteId) of the newly inserted row.
            res.redirect(`/empowering/${results.insertId}`);
        }
    });
});

// define a route for quote UPDATE
const update_quote_sql = `
    UPDATE
        quotes
    SET
        quoteName = ?,
        author = ?,
        themeId = ?
    WHERE
        quoteId = ?
`
app.post("/empowering/:id", ( req, res ) => {
    db.execute(update_quote_sql, [req.body.quoteName, req.body.author, req.body.themeName, req.params.id], (error, results) => {
        if (DEBUG)
            console.log(error ? error : results);
        if (error)
            res.status(500).send(error); //Internal Server Error
        else {
            res.redirect(`/empowering/${req.params.id}`);
        }
    });
});

// start the server
app.listen( port, () => {
    console.log(`App server listening on ${ port }. (Go to http://localhost:${ port })` );
} ); 