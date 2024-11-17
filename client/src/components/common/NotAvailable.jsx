import { Container, Row, Col, Spinner } from "react-bootstrap";

/**
 * This component is used to show a full page text when a page is not available.
 * @param {string} title 
 * @param {string} text 
 */
export default function NotAvailable(title, text) {
    return (
        <Container fluid className="d-flex flex-column justify-content-center align-items-center min-vh-100">
            <Row className="text-center">
                <Col>
                    <h1 className="display-3">{title}</h1>
                </Col>
            </Row>
            <Row className="text-center mt-4">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">{text}</span>
                </Spinner>
            </Row>
        </Container>
    );
}