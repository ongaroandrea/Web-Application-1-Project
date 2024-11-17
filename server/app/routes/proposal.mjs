import express from 'express';
import ProposalController from '../controllers/proposal.mjs';
import ErrorHandler from '../utils/helpers.mjs';
import { isLoggedIn} from './auth.mjs';
import { check } from 'express-validator'; // validation middleware

export default class ProposalRoutes {

    authenticator = null;
    proposalController = new ProposalController();
    router = null;
    errorHandler = null;

    constructor(authenticator) {
        this.router = express.Router();
        this.authenticator = authenticator
        this.proposalController = new ProposalController();
        this.errorHandler = new ErrorHandler();
        this.initRoutes();
    }

    getRouter() {
        return this.router;
    }

    initRoutes() {

        // GET /proposals
        this.router.get("/",
            (req, res, next) => this.proposalController.getAll(req.user ? req.user.id : null)
                .then(proposals => res.json({ data: proposals, message: "Proposals successfully retrieved" }))
                .catch((err) => next(err))
        );

        // GET /proposals/:id
        this.router.get("/:id",
            [
                isLoggedIn,
                check('id').isInt().toInt(),
                this.errorHandler.validateRequest
            ],
            (req, res, next) => this.proposalController.get(req.params.id, req.user.id)
                .then(proposal => res.json({ data: proposal, message: "Proposal successfully retrieved" }))
                .catch((err) => next(err))
        );

        // POST /proposals
        this.router.post(
            "/",
            [
                isLoggedIn,
                check('title').isString().isLength({ min: 1, max: 100}),
                check('budget').isInt({ min: 0 }).toInt(),
                this.errorHandler.validateRequest
            ],  
            (req, res, next) => this.proposalController.create(req.body.title, req.body.budget, req.user.id)
                .then(proposal => res.status(201).json())
                .catch((err) => next(err))
        );

        // PUT /proposals/:id
        this.router.put("/:id",
            [
                isLoggedIn,
                check('id').isInt().toInt(),
                check('title').isString().isLength({ min: 1, max: 100}),
                check('budget').isInt({ min: 0 }).toInt(),
                this.errorHandler.validateRequest
            ],
            (req, res, next) => this.proposalController.update(req.params.id, req.body.budget, req.body.title, req.user.id)
                .then(proposal => res.status(204).json())
                .catch((err) => next(err))
        );

        // DELETE /proposals/:id
        this.router.delete("/:id",
            [
                isLoggedIn,
                check('id').isInt().toInt(),
                this.errorHandler.validateRequest
            ],
            (req, res, next) => this.proposalController.delete(req.params.id, req.user.id)
                .then(proposal => res.status(204).json())
                .catch((err) => next(err))
        );
    }

}