const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const compression = require("compression");

// FOR SECURITY
// const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");

// IMPORTING LOCAL STUFF
const userRouter = require("./routes/userRoutes");

const app = express();

// IMPLEMENTING CORS SO THAT OTHER WEBSITES CAN USE OUR API
app.use(cors()); // THIS WILL WORK FOR SIMPLE REQUESTS LIKE (GET AND POST) BUT NOT FOR (PATCH, DELETE or PUT). or for cookies

// FOR NON-SIMPLE REQUEST WE USE app.options request.
app.options("*", cors()); // app.options() is just like app.get or post etc.

app.use(cookieParser()); // TO READ COOKIES SENT FROM CLIENT

app.use(express.static(`${__dirname}/public`)); // to access files from the server. (STATIC FILES)
app.use(express.json({ limit: "10kb" })); // to use data that is sent by user from front-end. limit the data to 10kb that user can sent.
app.use(express.urlencoded({ extended: true, limit: "10kb" })); // TO USE DATA COMING FROM FRONTEND BY SUBMITTING FORM

app.use(mongoSanitize()); // IT PREVENT ATTACKS LIKE: { email: {$gt: ""}, password: pass1228}

// DATA SANITIZATION (CLEARNING) AGAINST XSS (CROSS SITE SCRIPTING ATTACK)
app.use(xss());

// USE THIS MIDDLEWARE TO COMPRESS TEXT RESPONSE THAT WE SENT TO CLIENTS
app.use(compression());

if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

// ----------------------------------------------
// USE THIS TO LIMIT REQUEST TO A USER THAT CAN MAKE
// ----------------------------------------------

// GLOBAL MIDDLEWARE: LIMIT REQUEST
// let minutes = 60;
// const limiter = rateLimit({
//     max: 200,
//     windowMs: minutes * 60 * 1000,
//     message:
//         "Too many requests detected from your IP! Please try again after one hour.",
// });

// app.use("/api/", limiter);
// -----------------------------------------------

app.use("/api/v1/users", userRouter);

app.all("*", (req, res, next) => {
    res.status(200).json({
        status: true,
        data: "Invalid URL.",
    });
});

// Making Error Handling MIddleware.
// if we pass 4 arguments express will automatically recognize it as an error handling middleware
app.use((err, req, res, next) => {
    res.status(200).json({
        status: false,
        data: err,
    });
});

module.exports = app;
