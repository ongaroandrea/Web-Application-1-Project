import { Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function NotFoundLayout() {
    return (
        <>
            <Row><Col><h2>Pagina non trovata!</h2></Col></Row>
            <Row><Col> <img src="/GitHub404.png" alt="page not found" className="my-3" style={{ display: 'block' }} />
            </Col></Row>
            <Row><Col> <Link to="/" className="btn btn-primary mt-2 my-5">Vai alla pagina principale!</Link> </Col></Row>
        </>
    );
}