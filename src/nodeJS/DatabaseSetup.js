const utils = require("./utils");

module.exports = function (app, connection) {
   app.get('/resetDatabase', function(req, res) {
      const database = 'hsvisum2';
      const queryArray = [
        'DROP DATABASE hsvisumentities;',

        'CREATE DATABASE hsvisumentities;',

        'DROP DATABASE hsvisum;',

        'CREATE DATABASE hsvisum;',
        
        `CREATE TABLE hsvisum.entities (
          id int(11) NOT NULL AUTO_INCREMENT,
          entityName varchar(50) NOT NULL,
          fields text NOT NULL,
          active tinyint(1) NOT NULL,
          dateCreated date DEFAULT NULL,
          PRIMARY KEY (id))
        ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

        `CREATE TABLE hsvisum.layoutdata (
          id int(11) NOT NULL AUTO_INCREMENT,
          i varchar(50) NOT NULL,
          x int(11) NOT NULL,
          y int(11) NOT NULL,
          w int(11) NOT NULL,
          h int(11) NOT NULL,
          static tinyint(1) NOT NULL,
          parent varchar(50) NOT NULL,
          text text NOT NULL,
          bgcolor varchar(12) NOT NULL,
          type varchar(30) NOT NULL,
          scaleFactor int(11) NOT NULL,
          fontConfiguration text NOT NULL,
          entityTable VARCHAR(30) NULL,
          entityID INT NULL,
          PRIMARY KEY (id))
        ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,
        `INSERT INTO hsvisum.layoutdata 
        (id, i, x, y, w, h, static, parent, text, bgcolor, type, scaleFactor) VALUES
        (null, 'rootGC', 100, 100, 100, 100, 1, 'root', '', '#D3FFCC', 'gridlet', 1);`,

        `CREATE TABLE hsvisum.templatedata (
          id int(11) NOT NULL AUTO_INCREMENT,
          i varchar(50) NOT NULL,
          x int(11) NOT NULL,
          y int(11) NOT NULL,
          w int(11) NOT NULL,
          h int(11) NOT NULL,
          name varchar(30) NOT NULL,
          static tinyint(1) NOT NULL,
          parent varchar(50) NOT NULL,
          text text NOT NULL,
          bgcolor varchar(12) NOT NULL,
          type varchar(30) NOT NULL,
          scaleFactor int(11) NOT NULL,
          fontConfiguration text NOT NULL,
          PRIMARY KEY (id))
        ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,
        
        `INSERT INTO hsvisum.templatedata 
          (id, i, x, y, w, h, name, static, parent, text, bgcolor, type, scaleFactor) VALUES
          (null, 'rootBlock', 100, 100, 100, 100, '',0, 'rootTemplates', '', 'pink', 'gridlet', 1),
          (null, 'DefaultTemplate', 14, 12, 10, 10,'DefaultTemplate', 0, 'rootBlock', '', '#A0D2EB', 'template', 0),
          (null, 'DefaultCell', 0, 0, 12, 12,'DefaultCell', 1, 'DefaultTemplate', '', 'lemonchiffon', 'cell', 0);`
      ]

      queryArray.reduce((prev, cur) => {
        prev.then();
      }, Promise.resolve());
    });    
};
