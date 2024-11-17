
import { Outlet } from 'react-router-dom';
import { ViewBudgets } from '../budgets/PageLayout.jsx';
import Footer from '../common/Footer.jsx';
import Header from "../common/Header.jsx";
import PropTypes from 'prop-types';
import { Container } from 'react-bootstrap';
import { Toast, ToastBody } from 'react-bootstrap';
import { useContext } from 'react';
import FeedbackContext from '../../contexts/FeedbackContext.js';

export default function Layout(props) {
    const { user, loggedIn, budget, handleLogout, feedback } = props;

    const { setFeedback } = useContext(FeedbackContext);
    return (
        <div className="min-vh-100 d-flex flex-column">
            <Header logout={handleLogout} user={user} loggedIn={loggedIn} />
            <ViewBudgets budget={budget} user={user} loggedIn={loggedIn} />
            <Container className="mt-5">
                <Outlet />

                <Toast
                    show={feedback !== ''}
                    autohide
                    onClose={() => setFeedback('')}
                    delay={4000}
                    position="top-end"
                    className="position-fixed end-0 m-3"
                >
                    <ToastBody>
                        {feedback}
                    </ToastBody>
                </Toast>
            </Container>
            <Footer />
        </div>

    )
}

Layout.propTypes = {
    user: PropTypes.object,
    loggedIn: PropTypes.bool,
    budget: PropTypes.object,
    handleLogout: PropTypes.func,
    feedback: PropTypes.string
};