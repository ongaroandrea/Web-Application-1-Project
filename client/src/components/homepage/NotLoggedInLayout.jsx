import { Col, Row, Container, Spinner } from "react-bootstrap";
import ProposalList from "../proposals/ProposalList";
import PropTypes from 'prop-types';

const TEXT_WORKING_PROGRESS = "Definizione delle proposte in corso...";
const LOADING = "Loading...";
const TITLE_ACCEPTED_PROPOSALS = "Lista delle proposte accettate per l'anno"
const VALUTA = "€";
const DEFINED_BUDGET = "Il budget definito è stato di";

function WorkingProgressLayout() {

    return (
        <Container fluid className="d-flex flex-column justify-content-center align-items-center min-vh-100">
            <Row className="text-center">
                <Col>
                    <h1 className="display-3">{TEXT_WORKING_PROGRESS}</h1>
                </Col>
            </Row>
            <Row className="text-center mt-4">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">{LOADING}</span>
                </Spinner>
            </Row>
        </Container>
    );
}

function AcceptedProposalsLayout(props) {
    const { proposals, budget } = props;
    return (
        <Col className="mt-3">
            <h1>{TITLE_ACCEPTED_PROPOSALS} {budget.year} </h1>
            <span>{DEFINED_BUDGET} {budget.value}{VALUTA}</span>

            <ProposalList proposals={proposals} phase1={false} phase2={true} phase3={true} />
        </Col>
    );
}

AcceptedProposalsLayout.propTypes = {
    proposals: PropTypes.array,
    budget: PropTypes.object
}

export function NotLoggedInLayout(props) {

    const { budget, proposals } = props;
    return (
        budget == null || budget.phase <= 2 ?
            <WorkingProgressLayout />
            :
            <AcceptedProposalsLayout proposals={proposals} budget={budget} />
    );
}

NotLoggedInLayout.propTypes = {
    budget: PropTypes.object,
    proposals: PropTypes.array
}



