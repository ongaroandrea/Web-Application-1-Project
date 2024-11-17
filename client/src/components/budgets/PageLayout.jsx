import { useContext } from "react";
import CreateBudgetForm from "./BudgetForm.jsx";
import FeedbackContext from "../../contexts/FeedbackContext.js";
import { BudgetInfoLayout, NoBudgetInfo } from "./sub/BudgetLayout.jsx";
import { Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import API from "../../api/api.js";
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';


export function CreateBudgetLayout() {
    const { setFeedbackFromError, setShouldRefreshBudget } = useContext(FeedbackContext);

    const addBudget = (budget) => {
        if (budget.value < 0) budget.value = null;
        API.createBudget(budget)
            .then(() => {
                setShouldRefreshBudget(true)
            })
            .catch(e =>
                setFeedbackFromError(e)
            );
    };

    return <CreateBudgetForm onSubmit={addBudget} />

}

export function ViewBudgets(props) {
    return props.loggedIn ? <BudgetStatusBarLayout budget={props.budget} user={props.user} /> : null;
}

ViewBudgets.propTypes = {
    loggedIn: PropTypes.bool,
    budget: PropTypes.object,
    user: PropTypes.object
};

export function BudgetStatusBarLayout(props) {

    let location = useLocation();
    return (
        <Container fluid className="blue-background text-white p-5">
            {location.pathname != "/" ? <Link to="/" className="btn text-white bg-danger" >Pagina precedente</Link> : null}
            <Container>
                {props.budget && props.user ? <BudgetInfoLayout budget={props.budget} user={props.user} /> : <NoBudgetInfo />}
            </Container>
        </Container>
    );
}

BudgetStatusBarLayout.propTypes = {
    budget: PropTypes.object,
    user: PropTypes.object.isRequired
};


