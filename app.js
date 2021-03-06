require("dotenv").config();
require("express-async-errors");

var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
import cors from "cors";

import usersRouter from "./src/routers/users";
import boardsRouter from "./src/routers/boards";
import organizationRouter from "./src/routers/organizations";
import db from "./pkg/databases";
import { NewRepositoryContainer } from "./src/repositories";
import { NewServiceContainer } from "./src/services";
import { NewControllerContainer } from "./src/controllers";
import { ensureAuth } from "./src/middlewares/ensureAuth";
import jwt from "./pkg/jwt";
import bcryptPassword from "./internal/password";
import { responseId } from "./src/middlewares/response_id";
import { recoverException } from "./src/middlewares/recover_exception";
var app = express();

app.use(cors());
app.use(responseId);
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

app.use(
  "/users",
  usersRouter(controllerContainer, serviceContainer, ensureAuth)
);
app.use(
  "/boards",
  boardsRouter(controllerContainer, serviceContainer, ensureAuth)
);
app.use(
  "/organizations",
  organizationRouter(controllerContainer, serviceContainer, ensureAuth)
);

app.use(recoverException);
module.exports = app;
