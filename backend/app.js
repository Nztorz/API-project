const express = require("express");
require("express-async-errors");
const morgan = require("morgan");
const cors = require("cors");
const csurf = require("csurf");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");

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
const routes = require("./routes/index");
app.use("/", routes);


module.exports = app;