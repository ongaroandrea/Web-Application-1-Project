import { Link } from "react-router-dom";
import { Row, Col } from "react-bootstrap";


export default function NoBudget() {
    return (
        <Row>
            <Col>
                <p className="lead mt-3">Errore: Budget non ancora definito!</p>
                <Link className="btn btn-primary mx-auto" to="../../" relative="path">Pagina principale!</Link>
            </Col>
        </Row>
    );
}

