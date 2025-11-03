const express = require("express");
const router = express.Router();
const mysql = require("mysql2/promise")

const app = express();
const PORT = 80;
let db;

app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", "./views");


app.listen(PORT, async () => {
    
    console.log("<<<<< port: 80, server running >>>>>");
})

function dbConnect() {
    db = mysql.createPool({
        host     : 'localhost',
        user     : 'dev',
        password : '1234',
        database : 'menu',
        waitForConnections: true,
        connectionLimit: 20
    });

    return db;
}



module.exports = {
    app,
    router,
    dbConnect
};