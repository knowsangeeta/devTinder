const express = require('express');

const app = express();
const port = 7777;

app.get("/user",
    (req, res, next) => {
        console.log("Handling the route user!!!");
        next();

    },
    (req, res, next) => {
        console.log("Handling the route user 2");
        next();

    },
    (req, res, next) => {
        console.log("Handling the route user 3");
        next();

    },
    (req, res, next) => {
        console.log("Handling the route user 3");
        res.send("5th response");

    }
);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});