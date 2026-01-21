const { faker } = require("@faker-js/faker");
const mysql = require("mysql2");
const express = require("express");
const app = express();
const port = 3000;
const path = require("path");
const { connect } = require("http2");
const methodOverride = require("method-override");

app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true })); // to pares the form data
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "testDB",
  password: "Ron#12344567",
});

let createRandomUser = () => {
  return [
    faker.string.uuid(),
    // faker.internet.username(),
    // faker.internet.email(),
    // faker.internet.password(),
  ];
};

app.get("/", (req, res) => {
  let q = "SELECT count (*) FROM user";

  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let data = result[0]["count (*)"];
      res.render("home.ejs", { data });
    });
  } catch (err) {
    console.log(err);
  }

  app.get("/user", (req, res) => {
    let q = "SELECT * FROM USER";
    try {
      connection.query(q, (err, results) => {
        // let data=[];
        // data.push(result)
        res.render("show.ejs", { results });
      });
    } catch (err) {
      res.send(err);
    }
  });
});
// edit route
app.get("/user/:id/edit", (req, res) => {
  let { id } = req.params;
  let q = `SELECT * FROM USER WHERE id ='${id}'`;
  try {
    connection.query(q, (err, result) => {
      let data = result[0];
      console.log(data);
      res.render("edit.ejs", { data });
    });
  } catch (err) {
    res.send(err);
  }
});

// update route
app.patch("/user/:id", (req, res) => {
  let { id } = req.params;
  let { password: formPass, username: newUsername } = req.body;
  let q = `SELECT * FROM user WHERE id ="${id}"`;
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      // console.log(result)
      let data = result[0];
      console.log(data.password);
      if (formPass != data.password) {
        res.send("Wrong Password");
      } else {
        let q2 = `UPDATE user set username="${newUsername}" where id="${id}"`;
        connection.query(q2, (err, result) => {
          if (err) throw err;
          // res.send(result);
          res.redirect("/user");
        });
        // res.redirect("/user")
      }
      // res.send(data.password)
    });
  } catch (err) {
    console.log(err);
    res.send("some error");
  }
});

app.delete("/user/:id", (req, res) => {
  let { id } = req.params;
  console.log(id);
  let q = `DELETE FROM user where id="${id}"`;
  try {
    connection.query(q, (err, result) => {
      res.redirect("/user");
    });
  } catch (err){
    res.send(err)
  }
});

app.get("/user/new", (req, res) => {
  let data = createRandomUser();
  let id = data[0];
  // console.log(id)
  res.render("new.ejs", { id });
});

app.post("/user/:id",(req,res)=>{
  let {id}=req.params;
  let{username:newuser,email:newEmail,password:newPass}=req.body
  let q=`INSERT INTO USER (id,password,username,email) values(?,?,?,?);`
  // console.log(id)
  
  try {
    connection.query(q,[id,newPass,newuser,newEmail],(err, result) => {
      res.redirect("/user");
    });
  } catch (err){
    res.send(err)
  }


})

app.listen(port, (req, res) => {
  console.log("app is listerning");
});

// try{
//   connection.query(q,[data],(err,res)=>{
//     if(err) throw err;
//     console.log("data inserted");

//   })
// }catch(err){
//   console.log(err)
// }
// connection.end();
