//Route file for budget
import express from "express";
import BudgetController from "../controllers/budget.mjs";
import { isAdmin, isLoggedIn } from "../routes/auth.mjs";
import { check } from 'express-validator'; // validation middleware
import ErrorHandler from "../utils/helpers.mjs";

export default class BudgetRouter {

    authenticator = null;
    budgetController = new BudgetController();
    router = null;
    errorHanlder = null;

    constructor(authenticator) {
        this.router = express.Router();
        this.authenticator = authenticator
        this.budgetController = new BudgetController();
        this.errorHandler = new ErrorHandler();
        this.initRoutes();
    }

    getRouter() {
        return this.router;
    }

    initRoutes() {

        // POST /budgets
        this.router.post(
            "/",
            [
                isLoggedIn,
                isAdmin,
                check('value').isInt({ min: 1 }).toInt(),
                this.errorHandler.validateRequest
            ],
            (req, res, next) => this.budgetController.create(req.body.value, req.user.id)
                .then(budget => res.status(201).json({}))
                .catch((err) => next(err))
        )

        // PUT /budgets/current/next
        this.router.put(
            "/current/next",
            [
                isLoggedIn,
                isAdmin,
            ],
            (req, res, next) => this.budgetController.nextPhase()
                .then(budget => res.status(204).json({}))
                .catch((err) => next(err))
        )

        // DELETE /budgets/current
        this.router.delete(
            "/current",
            [
                isLoggedIn,
                isAdmin,
            ],
            (req, res, next) => this.budgetController.deleteCurrent()
                .then(budget => res.status(204).json({}))
                .catch((err) => next(err))
        )

        // GET /budgets/current
        this.router.get("/current",
            (req, res, next) => this.budgetController.getCurrent()
                .then(budget => res.json({ data: budget, message: "Current budget successfully retrieved" }))
                .catch((err) => next(err))
        )

    }
}


