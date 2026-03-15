//setting express /////////

const express = require('express');
const app = express();
const port = 3000;
const path = require('path');

// setting uuid npm package for generating random id 
const { v4: uuidv4 } = require('uuid');

// Set EJS as the templating engine
app.set('view engine', 'ejs');

// Set the directory where EJS templates are stored
app.set('views', path.join(__dirname, 'views'));

// setting for parsing form data  data//////////////////////////////// 

//Middleware to parse JSON bodies
app.use(express.json());

// Middleware to parse URL-encoded form data
app.use(express.urlencoded({ extended: true }));

//setting method-override npm package for using UPDATE,PUT and DELETE method
const methodOverride = require('method-override');
app.use(methodOverride('_method'));

// Serve static files from 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

//setting mysql2 npm package to connect server file  to database
const mysql = require('mysql2');

// //setting faker npm package for generating random id ,password username,etc
// const { faker } = require('@faker-js/faker');
// const { count } = require('console');

// Create a connection to the database
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'rp1022002nm',
    database: 'users'
});

// Function to generate a single user data 
// const FakeUser = () => {
//     return [
//         faker.string.uuid(),
//         faker.person.fullName(),
//         faker.internet.email(),
//         faker.internet.password(),

//     ];
// };



// //hundred random user data 

// let data = [];

// for (i = 1; i < 100; i++) {

//     data.push(FakeUser());


// }

//////////////////////////////////////////////////////////////////////////////

// it is root route show total number of users

app.get("/", (req, res) => {

    let q = "select count(*) from user";
    try {
        connection.query(q, (err, result) => {
            if (err) {
                throw err;

            }
            else {

                let count = result[0]["count(*)"];

                res.render("home.ejs", { count });


            }

        });

    } catch (err) {
        res.send("somthing is err in DB");
    }

});


// it route show all users credential

app.get("/users", (req, res) => {
    let q = "select * from user";
    try {
        connection.query(q, (err, results) => {
            if (err) {
                throw err;

            }
            else {



                res.render("users.ejs", { results });


            }

        });

    } catch (err) {
        res.send("somthing is err in DB");
    }
});

//it route ids for updating credential

app.get("/user/:id/edit", (req, res) => {
    let { id } = req.params;

    let q = `select * from user where userId = '${id}'`;
    try {
        connection.query(q, (err, result) => {
            if (err) {
                throw err;

            }
            else {

                res.render("edit.ejs", { result });



            }

        });

    } catch (err) {
        res.send("somthing is err in DB");
    }


});



// it route for submmiting edited user credential 

app.patch("/user/:id", (req, res) => {

    let { id } = req.params;

    let q = `select * from user where userId = '${id}'`;

    let { editUserName, editeMail, authPassword } = req.body;

    connection.query(q, (err, result) => {
        if (err) {
            throw err;

        }
        else {

            let user = result[0];
            if (user.password != authPassword) {
                res.send("<h1>worng password</h1>");

            }
            else {
                let q2 = `update user
            SET userName = "${editUserName}", email = "${editeMail}" where userId = "${id}"`;
                try {
                    connection.query(q2, (err, result) => {
                        if (err) {
                            throw err;

                        }
                        else {

                            res.redirect("/users");



                        }

                    });

                } catch (err) {
                    res.send("somthing is err in DB");
                }



            }



        }

    });



});

//it route show all users credential


app.get("/user/credential", (req, res) => {
    res.redirect("/users")
});


//// it route add new user credentail


app.get("/new/user", (req, res) => {

    res.render("new.ejs");

});

app.post("/new/user", (req, res) => {

    let { newUserName, newUserEmail, newUserPass } = req.body;

    let q = `insert into user(userId , userName, email, password)
    VALUES("${uuidv4()}","${newUserName}","${newUserEmail}","${newUserPass}")`;

    // let userdata = [newUserName, newUserEmail, newUserPass];

    try {
        connection.query(q, (err, result) => {
            if (err) {
                throw err;

            }
            else {

                res.redirect("/users");



            }

        });

    } catch (err) {
        res.send("somthing is err in DB");
    }




});


//it route to delete user credential

app.get("/user/deletion", (req, res) => {

    res.render("deletion.ejs");

});






app.delete("/User/deletion", (req, res) => {

    let { deleEmail, delePassword } = req.body;

    let q = `delete from user where password = ? and email = ?`;

    try {
        connection.query(q, [delePassword, deleEmail], (err, result) => {
            if (err) {
                throw err;

            }
            else {

                res.redirect("/users");



            }

        });

    } catch (err) {

        res.send("Wrong in db");

    }


});



//route for worng request ///////////////////

app.get(/.*/, (req, res) => {

    res.render("error.ejs");

});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});











































































