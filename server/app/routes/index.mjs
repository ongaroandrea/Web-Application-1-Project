import express from "express"
import morgan from "morgan"
import Authenticator from "./auth.mjs"
//import UserRoutes from "./user.mjs"
import BudgetRouter from "./budget.mjs"
import ProposalRoutes from "./proposal.mjs"
import PreferencesRouter from "./preference.mjs"

const prefix = "/api"

/**
 * Initializes the routes for the application.
 * 
 * @remarks
 * This function sets up the routes for the application.
 * It defines the routes for the user, authentication, product, and cart resources.
 * 
 * @param app - The express application instance.
 */
export default function initRoutes(app) {
    app.use(morgan("dev")) // Log requests to the console
    app.use(express.json({ limit: "25mb" }))
    app.use(express.urlencoded({ limit: '25mb', extended: true }))

    // define a route handler for the default home page
    app.get('/', (req, res) => {
        res.send('Welcome to the Budget Sociale API!');
    });

    /**
     * The authenticator object is used to authenticate users.
     * It is used to protect the routes by requiring users to be logged in.
     * It is also used to protect routes by requiring users to have the correct role.
     * All routes must have the authenticator object in order to work properly.
     */
    const authenticator = new Authenticator(app)
    const budgetRouter = new BudgetRouter(authenticator)
    const proposalRoutes = new ProposalRoutes(authenticator)
    const preferencesRouter = new PreferencesRouter(authenticator)

    /**
     * The routes for the budget, proposal, preferences are defined here.
     */
    app.use(`${prefix}/budgets`, budgetRouter.getRouter())
    app.use(`${prefix}/proposals`, proposalRoutes.getRouter())
    app.use(`${prefix}/preferences`, preferencesRouter.getRouter())

    /**
     * Registers the error handler.
     */
    app.use((err, req, res, next) => {
        return res.status(err.customCode || 503).json({
            message: err.customMessage || "Internal Server Error",
        });
    })

}