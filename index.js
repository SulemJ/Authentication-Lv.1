import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
const app = express();
const port = 3000;
const db = new pg.Client({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
db.connect();
app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.get("/register", (req, res) => {
  res.render("register.ejs");
});

app.post("/register", async (req, res) => {
  const email = req.body.username;
  const password = req.body.password ;
 
  try {
    const checkResult = await db.query(`select * from users where email = '${email}'`);
    if (checkResult.rows.length > 0) {
      res.send("already registered");
    } else {
      await db.query(`insert into users(email, password) values('${email}', '${password}') `);
 res.render("secrets.ejs");
    }
  } catch (error) {
    console.error("Failed to make request:", error.message);
    res.render("index.ejs", {
      error: error.message,
    });
  }
});

app.post("/login", async (req, res) => {
  const email = req.body.username;
  const password = req.body.password ;

    const checkResult = await db.query(`select * from users where email = '${email}'`);
    if (checkResult.rows.length > 0) {
    console.log(checkResult.rows[0].password);
        if (checkResult.rows[0].password == password) {
          res.render("secrets.ejs");
        } else {
          res.send("incorrect password");
        }
    } else { 
     res.send("not registered");
    }
  });

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
