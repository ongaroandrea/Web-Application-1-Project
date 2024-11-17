import { check } from 'express-validator'; // validation middleware
import PreferenceController from '../controllers/preference.mjs';
import { isLoggedIn } from "../routes/auth.mjs";
import ErrorHandler from '../utils/helpers.mjs';
import express from 'express';

export default class PreferenceRouter {
    
    authenticator = null;
    preferenceController = null;
    router = null;
    errorHandler = null;

    constructor(authenticator) {
        this.router = express.Router();
        this.authenticator = authenticator
        this.preferenceController = new PreferenceController();
        this.errorHandler = new ErrorHandler();
        this.initRoutes();
    }

    getRouter() {
        return this.router;
    }

    initRoutes() {

        // GET /preferences
        this.router.get("/",
            [
                isLoggedIn,
            ],
            (req, res, next) => this.preferenceController.getAll(req.user.id)
                .then(preferences => res.json({ data: preferences, message: "Preferences successfully retrieved" }))
                .catch((err) => next(err))
        );

        // GET /preferences/:id
        this.router.get("/:id",
            [
                (req, res, next) => req.params.id == "proposals" ? next("route") : next(),
                isLoggedIn,
                check('id').isInt().toInt(),
                this.errorHandler.validateRequest
            ],
            (req, res, next) => this.preferenceController.get(req.params.id, req.user.id)
                .then(preference => res.json({ data: preference, message: "Preference successfully retrieved" }))
                .catch((err) => next(err))
        );

        // GET /preferences/proposals
        this.router.get("/proposals",
            [
                isLoggedIn,
            ],
            (req, res, next) => this.preferenceController.getProposals(req.user.id)
                .then(proposals => res.json({ data: proposals, message: "Proposals successfully retrieved" }))
                .catch((err) => next(err))
        );

        // POST /preferences
        this.router.post(
            "/",
            [
                isLoggedIn,
                check('value').isInt().isIn([1, 2, 3]),
                check('proposalID').isInt().toInt(),
                this.errorHandler.validateRequest
            ],
            (req, res, next) => this.preferenceController.create(req.body.value, req.body.proposalID, req.user.id)
                .then(preference => res.status(201).json({ }))
                .catch((err) => next(err))
        );

        // PUT /preferences/:id
        this.router.put("/:id",
            [
                isLoggedIn,
                check('id').isInt().toInt(),
                check('value').isInt().isIn([1, 2, 3]),
                this.errorHandler.validateRequest
            ],
            (req, res, next) => this.preferenceController.update(req.params.id, req.body.value, req.user.id)
                .then(preference => res.status(204).json({ }))
                .catch((err) => next(err))
        );

        // DELETE /preferences/:id
        this.router.delete("/:id",
            [
                isLoggedIn,
                check('id').isInt().toInt(),
                this.errorHandler.validateRequest
            ],
            (req, res, next) => this.preferenceController.delete(req.params.id)
                .then(() => res.status(204).json({ }))
                .catch((err) => next(err))
        );
    }

    
}