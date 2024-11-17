/* eslint-disable react/no-unescaped-entities */
import { useContext } from "react";
import PropTypes from 'prop-types';
import FeedbackContext from "../../../contexts/FeedbackContext.js";
import API from "../../../api/api.js";
import { Row, Col, Button, Container } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";

const RESET_TEXT = "Resetta il budget";
const NEXT_TEXT = "Prosegui alla prossima fase";
const CLOSE_TEXT = "Termina il processo";

/**
 * This function renders the budget info layout.
 * @param {*} props 
 * @returns 
 */
export function BudgetInfoLayout(props) {

    const navigate = useNavigate();
    
    const { setFeedbackFromError, setShouldRefreshBudget } = useContext(FeedbackContext);
    const { budget, user } = props;
    /**
     * 
     * This function resets the budget.
     * It calls the API to delete the current budget.
     * If the operation is successful, it sets the shouldRefreshBudget state to true to refresh the budget.
     * If the operation fails, it sets the feedback from the error.
     */
    const resetBudget = () => {
        API.deleteCurrentBudget()
            .then(() => {
                setShouldRefreshBudget(true)
                navigate('/');
            })
            .catch(e => {
                setFeedbackFromError(e);
            });
    };

    /**
     * This function goes to the next phase of the budget.
     * It calls the API to go to the next phase.
     * If the operation is successful, it sets the shouldRefreshBudget state to true to refresh the budget.
     */
    const nextPhase = () => {
        API.nextPhaseBudget()
            .then(() => {
                setShouldRefreshBudget(true)
                navigate('/');
            })
            .catch(e => {
                setFeedbackFromError(e);
            });
    }


    return (

        <Row>
            <Col xs={6}>
                <h3> <b>Budget disponibile per l'anno</b> {budget.year}</h3>
                <span><b>Fase Attuale: {budget.phase}</b></span><br />
                <span><b>Budget impostato: {budget.value}€</b></span><br />
                {user.role === 'admin' ?
                    <div className="">
                        {budget.phase === 3 ?<Button className="mt-3 me-3" onClick={resetBudget}>{RESET_TEXT}</Button> : null}
                        {budget.phase !== 3 ? <Button className="mt-3" onClick={nextPhase}>
                            {budget.phase == 2 ? CLOSE_TEXT : NEXT_TEXT} </Button> : null}
                    </div> : null}
            </Col>
        </Row>

    );
}

BudgetInfoLayout.propTypes = {
    budget: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired
};

/**
 * This function renders a message when there is no budget info. 
 */
export function NoBudgetInfo() {
    return (
        <Container>
            <h1 className="text-uppercase">Budget</h1>
            <p className="text-uppercase subtitle">Nessun budget impostato per l'anno corrente</p>
        </Container>
    );
}


