const db = require("./db_connection");


/**** Read the subjects table ****/

const select_subjects_sql = "SELECT * FROM themes";

db.execute(select_themes_sql, 
    (error, results) => {
        if (error) 
            throw error;

        console.log("Table 'themes' contents:")
        console.log(results);
    }
);

/**** Read the assignments table, joined with subjects table ****/


const select_quotes_sql = `
SELECT *
FROM quotes
JOIN themes
    ON quotes.themeId = themes.themeId
ORDER BY
    quotes.themeId;
`;

db.execute(select_quotes_sql, 
    (error, results) => {
        if (error) 
            throw error;

        console.log("Table 'quotes' contents:")
        console.log(results);
    }
);

db.end();