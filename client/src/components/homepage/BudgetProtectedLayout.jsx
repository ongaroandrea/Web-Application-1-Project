import { Outlet, Navigate } from "react-router-dom";
import PropTypes from 'prop-types';

export default function BudgetProtectedLayout(props) {
    const {budget} = props;

    return budget ? <Outlet /> : <Navigate to="/" />;
}

BudgetProtectedLayout.propTypes = {
    budget: PropTypes.object
};