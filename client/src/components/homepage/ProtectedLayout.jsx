import { Outlet, Navigate } from "react-router-dom";
import PropTypes from 'prop-types';

export default function ProtectedLayout(props) {
    const {loggedIn} = props;
    return loggedIn ? <Outlet /> : <Navigate to="/login" />;
}

ProtectedLayout.propTypes = {
    loggedIn: PropTypes.bool
};