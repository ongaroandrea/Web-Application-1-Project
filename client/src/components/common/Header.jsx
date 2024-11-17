import PropTypes from "prop-types";
import { Col, Container, Row, Dropdown, Image } from "react-bootstrap/";
import { LoginButton } from '../auth/sub/Buttons.jsx';

function ProfileButton(props) {
    return (
        <Dropdown>
            <Dropdown.Toggle id="dropdown-basic text-white blue-background">
                <span className="ms-2 text-light">{props.user.username}</span>
            </Dropdown.Toggle>

            <Dropdown.Menu>
                <Dropdown.Item onClick={props.logout}>Logout</Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>

    )
}

ProfileButton.propTypes = {
    user: PropTypes.object,
    logout: PropTypes.func
}

export default function Header(props) {
    return <header className="py-1 py-md-3 border-bottom bg-primary">
        <Container fluid className="gap-3 align-items-center">
            <Row>
                <Col xs={6} md={4}>
                    <a href="/"
                        className="d-flex align-items-center justify-content-center justify-content-md-start h-100 link-light text-decoration-none">
                        <Image src="favicon.ico" height={30} className="me-2" />
                        <span className="h5 mb-0">Budget Sociale</span>
                    </a>
                </Col>

                <Col xs={5} md={8} className="d-flex align-items-center justify-content-end">
                    <div className="me-md-3">
                        {props.loggedIn ? <div className="me-3">
                            <ProfileButton logout={props.logout} user={props.user} />
                        </div> : <LoginButton />}
                    </div>
                </Col>
            </Row>
        </Container>
    </header>;
}

Header.propTypes = {
    logout: PropTypes.func,
    user: PropTypes.object,
    loggedIn: PropTypes.bool
}
