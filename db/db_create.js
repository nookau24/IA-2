const db = require("./db_connection");
//subjects => themes
//assignments have a subject => quotes have a theme

/**** Drop existing tables, if any ****/

const drop_quotes_table_sql = "DROP TABLE IF EXISTS quotes;"

db.execute(drop_quotes_table_sql);

const drop_themes_table_sql = "DROP TABLE IF EXISTS themes;"

db.execute(drop_themes_table_sql);


/**** Create tables ****/

const create_themes_table_sql = `
    CREATE TABLE themes (
        themeId INT NOT NULL AUTO_INCREMENT,
        themeName VARCHAR(45) NOT NULL,
        PRIMARY KEY (themeId));
`
db.execute(create_themes_table_sql);

const create_quotes_table_sql = `
CREATE TABLE quotes (
    quoteId int(11) NOT NULL AUTO_INCREMENT,
    quoteName varchar(45) NOT NULL,
    author varchar(45) NOT NULL,
    likeCount int(11) DEFAULT NULL,
    themeId int(11) NOT NULL,
    PRIMARY KEY (quoteId),
    KEY themeId_idx (themeId),
    CONSTRAINT themeId FOREIGN KEY (themeId) REFERENCES themes (themeId) ON DELETE RESTRICT ON UPDATE CASCADE
  ) ENGINE=InnoDB DEFAULT CHARSET=latin1;
`

// const create_quotes_table_sql = `
//     CREATE TABLE quotes (
//         quoteId INT NOT NULL AUTO_INCREMENT,
//         quoteName VARCHAR(45) NOT NULL,
//         author VARCHAR(45) NOT NULL,
//         likeCount INT NULL,
//         themeId INT NOT NULL
//         PRIMARY KEY (quoteId),
//         INDEX quoteTheme_idx (themeId ASC),
//         CONSTRAINT quoteTheme
//             FOREIGN KEY (themeId)
//             REFERENCES themes (themeId)
//             ON DELETE RESTRICT
//             ON UPDATE CASCADE);
// `

db.execute(create_quotes_table_sql);

db.end();