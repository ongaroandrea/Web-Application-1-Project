import PropTypes from 'prop-types';
import { Col, Row, Card, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useContext } from "react";
import FeedbackContext from "../../contexts/FeedbackContext.js";

const BUDGET_TEXT = "In qualità di amministratore puoi creare un budget per l'anno in corso. Clicca qui per crearne uno."

const PROPOSAL_TEXT = "Inserisci una proposta per il budget in corso. Se hai già inserito una proposta, puoi modificarla o eliminarla."
const PROPOSA_TEXT_PHASE_2 = "Le proposte sono state chiuse. Puoi visualizzare le proposte inserite e le preferenze espresse."

const PREFERENCE_TEXT = "Inserisci una preferenza per il budget in corso. Se hai già inserito una preferenza, puoi modificarla o eliminarla."
const PREFERENCE_TEXT_PHASE_3 = "Le preferenze sono state chiuse. Puoi visualizzare le preferenze inserite."

const BUDGET_NOT_DEFINED = "Il budget non è stato definito. Contatta l'amministratore per maggiori informazioni."

const ADD = "Aggiungi";
const VIEW = "Visualizza";

function CardLayout(props) {
    return (
        <Card className='custom-border'>
            <Card.Body>
                <Card.Title>{props.title}</Card.Title>
                <Card.Text>
                    {props.text}
                </Card.Text>
                <Link className="btn btn-lg text-white custom-color" to={props.link}>{props.linkText}</Link>
            </Card.Body>
        </Card>
    );
}

CardLayout.propTypes = {
    title: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    link: PropTypes.string.isRequired,
    linkText: PropTypes.string.isRequired
};

export function HomePageLayout(props) {

    const { setShouldRefreshBudget } = useContext(FeedbackContext);
    
    let content = []
    if (props.budget != null) {
        const phase = props.budget.phase;
        if (phase >= 1) {
            content.push(<Col md={6} className="mb-4" key={"proposte"}><CardLayout title="Proposte" text={phase == 1 ? PROPOSAL_TEXT : PROPOSA_TEXT_PHASE_2} link="/proposals" linkText={phase == 1 ? ADD : VIEW} /></Col>)
        }
        if (phase >= 2) {
            content.push(<Col md={6} key={"preferenze"}><CardLayout title="Preferenze" text={phase == 2 ? PREFERENCE_TEXT : PREFERENCE_TEXT_PHASE_3} link="/preferences" linkText={phase == 2 ? ADD : VIEW} /></Col>)
        }
    } else {
        if (props.user.role === "admin") {
            content.push(<Col md={6} key={"budget"}><CardLayout title="Budget" text={BUDGET_TEXT} link="/budgets" linkText="Aggiungi" /></Col>)
        } else {
            content.push(<Container fluid key={"all"}>
                <Row className="text-center">
                    <Col>
                        <h1 className="display-5">{BUDGET_NOT_DEFINED}</h1>
                        <button className="btn btn-lg text-white custom-color" onClick={() => setShouldRefreshBudget(true)}>Controlla se è stato definito ora. Clicca qui!</button>
                    </Col>
                </Row>
            </Container>)
        }

    }
    return (
        <Row>
            {content}
        </Row>

    );
}

HomePageLayout.propTypes = {
    user: PropTypes.object.isRequired,
    budget: PropTypes.object
};



