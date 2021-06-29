import express from "express";
import userController from "../UserController";

export const userRouter = express.Router();

userRouter.post("/signup", userController.createUser);
userRouter.post("/login", userController.getUserByEmail);