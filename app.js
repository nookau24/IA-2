const DEBUG = true;

//set up the server
const express = require( "express" );
const app = express();
const port = 3200;
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
const read_index_all_sql = `
    SELECT 
        quoteId, quoteName, author, themeName, 
        quotes.themeId as themeId
    FROM quotes
    JOIN themes
        ON quotes.themeId = themes.themeId
    ORDER BY quotes.quoteId DESC
    `
app.get( "/", ( req, res ) => {
    db.execute(read_index_all_sql, (error, results) => {
        if (DEBUG)
            console.log(error ? error : results);
        if (error)
            res.status(500).send(error); //Internal Server Error
        else {
            let data = { qlist : results };
            res.render('index', data);
        }
    });
    // res.render('index');
    //res.sendFile( __dirname + "/views/index.html" );
} );

// // define a route for the empowering page
// app.get( "/empowering", ( req, res ) => {
//     res.sendFile( __dirname + "/views/empowering.html" );
// } );

// define a route for the quote list page
const read_empowering_all_sql = `
    SELECT 
        quoteId, quoteName, author, themeName, likeCount,
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

        function liker(){
            likeCount++;
        }
    });
});


// // define a route for the liked quotes list page
// app.get( "/likedquotes", ( req, res ) => {
//     res.sendFile( __dirname + "/views/likedquotes.html" );
// } );

// define a route for the quote list page
const read_likedquotes_all_sql = `
    SELECT 
        quoteId, quoteName, author, themeName, likeCount,
        quotes.themeId as themeId
    FROM quotes
    JOIN themes
        ON quotes.themeId = themes.themeId
    ORDER BY quotes.quoteId DESC
`
app.get( "/likedquotes", ( req, res ) => {
    db.execute(read_likedquotes_all_sql, (error, results) => {
        if (DEBUG)
            console.log(error ? error : results);
        if (error)
            res.status(500).send(error); //Internal Server Error
        else {
            let data = { qlist : results };
            res.render('likedquotes', data);
        }
    });
});

// define a route for the quote detail page
const read_empowering_detail_sql = `
    SELECT
        quoteId, quoteName, author, themeName, likeCount,
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
        (quoteName, author, themeId) 
    VALUES 
        (?, ?, ?);
`
app.post("/empowering", ( req, res ) => {
    db.execute(create_quote_sql, [req.body.quoteName, req.body.author, 1], (error, results) => {
        if (DEBUG)
            console.log(error ? error : results);
        if (error)
            res.status(500).send(error); //Internal Server Error
        else {
            //results.insertId has the primary key (quoteId) of the newly inserted row.
            res.redirect("/empowering");
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
        themeId = ?,
        likeCount = ?
    WHERE
        quoteId = ?
`
app.post("/empowering/:id", ( req, res ) => {
    db.execute(update_quote_sql, [req.body.quoteName, req.body.author, req.body.themeName, req.body.likeCount, req.params.id], (error, results) => {
        if (DEBUG)
            console.log(error ? error : results);
        if (error)
            res.status(500).send(error); //Internal Server Error
        else {
            res.redirect(`/empowering`);
        }
    }
    );
    
});


// //liked quotes
// app.post("/empowering/:id", function(req,res){
//     TestData.findById(req.params.id, function(err, theUser){
//         if(err){
//             console.log(err);
//         } else {
//             theUser.likes += 1;
//             theUser.save();
//             console.log(theUser.likes);
//         }
//     });
// });

//FUNNY ROUTES *****!*!**!*!**!

// define a route for the quote list page
const read_funny_all_sql = `
    SELECT 
        quoteId, quoteName, author, themeName, 
        quotes.themeId as themeId
    FROM quotes
    JOIN themes
        ON quotes.themeId = themes.themeId
    ORDER BY quotes.quoteId DESC
`
app.get( "/funny", ( req, res ) => {
    db.execute(read_funny_all_sql, (error, results) => {
        if (DEBUG)
            console.log(error ? error : results);
        if (error)
            res.status(500).send(error); //Internal Server Error
        else {
            let data = { funnyqlist : results };
            res.render('funny', data);
        }
    });
});

//define a route for the quote detail page
const read_funny_detail_sql = `
    SELECT
        quoteId, quoteName, author, themeName,
        quotes.themeId as themeId
    FROM quotes
    JOIN themes
        ON quotes.themeId = themes.themeId
    WHERE quoteId = ?
`
app.get( "/funny/:id", ( req, res ) => {
    db.execute(read_funny_detail_sql, [req.params.id], (error, results) => {
        if (DEBUG)
            console.log(error ? error : results);
        if (error)
            res.status(500).send(error); //Internal Server Error
        else if (results.length == 0)
            res.status(404).send(`No quote found with id = "${req.params.id}"` ); // NOT FOUND
        else {
            let data = {funnyqdetail: results[0]}; // results is still an array, get first (only) element
            res.render('funnydetail', data); 
            // What's passed to the rendered view: 
            //  hw: {quoteId: ___ , quoteName: ___ , author: ___ , 
            //    themeName: ___ 
            //  }
        }
    });
});

// define a route for quote DELETE
const delete_funnyquote_sql = `
    DELETE 
    FROM
        quotes
    WHERE
        quoteId = ?
`
app.get("/funny/:id/delete", ( req, res ) => {
    db.execute(delete_funnyquote_sql, [req.params.id], (error, results) => {
        if (DEBUG)
            console.log(error ? error : results);
        if (error)
            res.status(500).send(error); //Internal Server Error
        else {
            res.redirect("/funny");
        }
    });
});

// define a route for quote CREATE
const create_funnyquote_sql = `
    INSERT INTO quotes 
        (quoteName, author, themeId) 
    VALUES 
        (?, ?, ?);
`
app.post("/funny", ( req, res ) => {
    db.execute(create_funnyquote_sql, [req.body.quoteName, req.body.author, 2], (error, results) => {
        if (DEBUG)
            console.log(error ? error : results);
        if (error)
            res.status(500).send(error); //Internal Server Error
        else {
            //results.insertId has the primary key (quoteId) of the newly inserted row.
            res.redirect("/funny");
        }
    });
});
  let likes = 0;


// start the server
app.listen( port, () => {
    console.log(`App server listening on ${ port }. (Go to http://localhost:${ port })` );
} ); 