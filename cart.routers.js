import express from "express";
import { cartController } from "./cart.controller.js";

export var router=express.Router();

var cart_con_obj=new cartController();
router.get("/cre",cart_con_obj.create(req,res,next));
router.get("/add",cart_con_obj.add(req,res,next));
router.get("/rem",cart_con_obj.rem(req,res,next));
