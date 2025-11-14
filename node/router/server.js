const express = require("express");
const router = express.Router();
// const mysql = require("mysql2/promise")
const { Pool } = require("pg")

const app = express();
const PORT = process.env.PORT || 80;

app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", "./views");


app.listen(PORT, async () => {
    console.log("<<<<< port:", PORT, ",server running >>>>>");
})

const db = new Pool({
    connectionString: "postgresql://dev:8VQvTpmYiyVy3NRUBb1wJwlViu7JzK3o@dpg-d4atnvgdl3ps73bm9hcg-a.oregon-postgres.render.com/menu_ysw3",
    ssl: {
        rejectUnauthorized: false
    }
})

module.exports = {
    app,
    router,
    db
}