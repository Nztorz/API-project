const express = require("express");
require("express-async-errors");
const morgan = require("morgan");
const cors = require("cors");
const csurf = require("csurf");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const { ValidationError }= require("sequelize");


const { environment } = require("./config/index");
const isProduction = environment === "production";

const app = express();

// Use morgan
// Log information about requests when in dev
app.use(morgan("dev"));

app.use(cookieParser());
app.use(express.json());

// setting CORS for development
if(!isProduction) {
    app.use(cors());
}

app.use(helmet(
    helmet.crossOriginResourcePolicy({ policy: "cross-origin" })
))

// create req.csrfToken method
app.use(
    csurf({
        cookie: {
            secure: isProduction,
            sameSite: isProduction && "Lax",
            httpOnly: true
        }
    })
)


// importing router
const routes = require("./routes");
app.use("/", routes);


// 404 error handler
app.use((_req, _res, next) => {
    const err = new Error("The requested resource couldn't be found.");
    err.title = "Resource Not Found";
    err.errors = { message: "The requested resource couldn't be found"};
    err.status = 404;
    next(err);
});

// sequelize errors
app.use((err, _req, _res, next) => {
    if(err instanceof ValidationError) {
        let errors = {};
        for(let error of err.errors) {
            errors[error.path] = error.message;
        }
        err.title = "Validation error";
        err.errors = errors;
    }

    next(err);
});

// error handler formatter
app.use((err, _req, res, _next) => {
    res.status(err.status || 500);
    console.error(err);
    res.json({
        title:err.title || "Server Error",
        message: err.message,
        errors: err.errors,
        stack: isProduction ? null : err.stack
    });
});

module.exports = app;