const db = require("./db_connection");

/**** Delete *CONTENTS OF* existing tables (but not dropping tables themselves) ****/

const delete_quotes_table_sql = "DELETE FROM quotes;"

db.execute(delete_quotes_table_sql);

const delete_themes_table_sql = "DELETE FROM themes;"

db.execute(delete_themes_table_sql);

/**** Create some sample subjects and assignments ****/

const insert_theme_sql = `
    INSERT INTO themes 
        (themeId, themeName) 
    VALUES 
        (?, ?);
`

db.execute(insert_theme_sql, [1, 'Empowering']);

db.execute(insert_theme_sql, [2, 'Funny']);

db.execute(insert_theme_sql, [3, 'Love']);

//left out quoteId just like how tutorial left out assignmentId
const insert_quote_sql = `
    INSERT INTO quotes
        (quoteName, author, likeCount, themeId) 
    VALUES 
        (?, ?, ?, ?);
`

//subjectId: 2 => 'Math'
db.execute(insert_quote_sql, ['Make today count', 'Noor Kaur', 2, 1]);

//subjectId: 3 => 'Language'
db.execute(insert_quote_sql, ['Live, laugh, love', 'Navneet Kaur', 3, 3]);

//subjectId: 1 => 'Comp Sci'
db.execute(insert_quote_sql, ['Go bananas!', 'Curious George', null, 2]);


/**** Create some additional subjects and assignments that aren't in the prototypes ****/

db.execute(insert_theme_sql, [5, 'Existential']);

db.execute(insert_theme_sql, [6, 'Seasonal']);

//subjectId: 1 => 'Comp Sci'
db.execute(insert_quote_sql, ['Lorem ipsum', 'Albert Einstein', 1, 4]);

//subjectId: 4 => 'Music'
db.execute(insert_quote_sql, ['dolor init', 'Shakespeare', 4, 5]);

//subjectId: 5 => 'Biology'
db.execute(insert_quote_sql, ['Latin word', 'Marilyn Monroe', 5, 1]);

//subjectId: 6 => 'History'
db.execute(insert_quote_sql, ['Greek word', 'Barack Obama', 6, 2]);

db.end();