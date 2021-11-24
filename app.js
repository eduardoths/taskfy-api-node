require("dotenv").config();

var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
import cors from "cors";

import usersRouter from "./src/routers/users";
import boardsRouter from "./src/routers/boards";
import db from "./pkg/databases";
import { NewRepositoryContainer } from "./src/repositories";
import { NewServiceContainer } from "./src/services";
import { NewControllerContainer } from "./src/controllers";
import { ensureAuth } from "./src/middlewares/ensureAuth";
import jwt from "./pkg/jwt";
import bcryptPassword from "./internal/password";
var app = express();

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

const repositoryContainer = NewRepositoryContainer(db);
const serviceContainer = NewServiceContainer(
  repositoryContainer,
  jwt,
  bcryptPassword
);
const controllerContainer = NewControllerContainer(serviceContainer);

app.use("/users", usersRouter(controllerContainer, serviceContainer));
app.use(
  "/boards",
  boardsRouter(controllerContainer, serviceContainer, ensureAuth)
);

module.exports = app;
