import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css';

import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { CreatePreferenceLayout, EditPreferenceLayout, PreferenceListLayout } from './components/preferences/PreferencePageLayout.jsx'
import { ProposalListLayout, EditProposalLayout, CreateProposalLayout } from './components/proposals/ProposalPageLayout.jsx'

import { CreateBudgetLayout } from './components/budgets/PageLayout.jsx';
import { HomePageLayout } from './components/homepage/HomePageLayout.jsx';
import { NotLoggedInLayout } from './components/homepage/NotLoggedInLayout.jsx';

import NotFoundLayout from './components/common/NotFound.jsx';
import LoginForm from './components/auth/LoginForm.jsx';
import FeedbackContext from "./contexts/FeedbackContext.js";
import API from "./api/api.js";
import Layout from './components/homepage/DefaultLayout.jsx';
import ProtectedLayout from './components/homepage/ProtectedLayout.jsx';
import BudgetProtectedLayout from './components/homepage/BudgetProtectedLayout.jsx';
import ErrorPage from './components/common/ErrorPage.jsx';

function App() {

    // This state is used to store the feedback message to be shown in the toast
    const [feedback, setFeedback] = useState('');

    const setFeedbackFromError = (err) => {
        let message = '';
        if (err.message) message = err.message;
        else message = "Unknown Error";
        setFeedback(message); // Assuming only one error message at a time
    };

    const location = useLocation();
    const [budget, setBudget] = useState(null);
    const [proposals, setProposals] = useState([]);

    // This state is used to force a refresh of the content
    const [shouldRefreshBudget, setShouldRefreshBudget] = useState(null);
    const [shouldRefreshProposals, setShouldRefreshProposals] = useState(null);
    const [shouldRefreshPreferences, setShouldRefreshPreferences] = useState(null);

    const [user, setUser] = useState(null);
    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        // Checking if the user is already logged-in
        // This useEffect is called only the first time the component is mounted (i.e., when the page is (re)loaded.)
        API.getUserInfo()
            .then(user => {
                setLoggedIn(true);
                setUser(user);
            }).catch(e => {
                if (loggedIn)
                    setFeedbackFromError(e);
                setLoggedIn(false); setUser(null);
            });
    }, [loggedIn, location]);

    /**
     * This function handles the login process.
     * It requires a username and a password inside a "credentials" object.
     */
    const handleLogin = async (credentials) => {
        const user = await API.logIn(credentials);
        setUser(user);
        setLoggedIn(true);
        setFeedback("Benvenuto, " + user.username);
    };

    /**
     * This function handles the logout process.
     */
    const handleLogout = async () => {
        await API.logOut();
        setLoggedIn(false);
        setUser(null);
    };

    useEffect(() => {
        API.getCurrentBudget()
            .then(budget => {
                setBudget(budget)
            })
            .then(() => {
                setShouldRefreshBudget(false)
            })
            .catch(() => {
                setBudget(null);
                setShouldRefreshBudget(false)
            });
    }, [loggedIn, shouldRefreshBudget, location]);

    useEffect(() => {
        if(!budget) setProposals([]);
        API.getProposals()
            .then(proposals => {
                setProposals(proposals)
            })
            .then(() => {
                setShouldRefreshProposals(false)
            })
            .catch(() => {
                setProposals([]);
                setShouldRefreshProposals(false)
            });
    }, [budget, shouldRefreshProposals]);


    return (
        <FeedbackContext.Provider value={{ setFeedback, setFeedbackFromError, setShouldRefreshBudget, setShouldRefreshProposals, setShouldRefreshPreferences }}>
            <Routes>
                <Route element={<Layout user={user} budget={budget} loggedIn={loggedIn} handleLogout={handleLogout} feedback={feedback} />} >
                    <Route path="/" element={loggedIn ? <HomePageLayout user={user} budget={budget} /> : <NotLoggedInLayout budget={budget} proposals={proposals} />} />
                    <Route path="/login" element={loggedIn ? <HomePageLayout user={user} budget={budget} /> : <LoginForm login={handleLogin} />} />


                    <Route element={<ProtectedLayout loggedIn={loggedIn} />} errorElement={<ErrorPage />} >
                        <Route path="/budgets" element={<CreateBudgetLayout />} />

                        <Route element={<BudgetProtectedLayout budget={budget} />} >
                            <Route path="/proposals" element={<ProposalListLayout budget={budget} user={user} proposals={proposals} />} />
                            <Route path="/proposals/:id" element={<EditProposalLayout budget={budget} user={user} />} />
                            <Route path="/proposals/create" element={<CreateProposalLayout budget={budget} />} />
                            <Route path="/preferences" element={<PreferenceListLayout budget={budget} shouldRefreshPreferences={shouldRefreshPreferences} />} />
                            <Route path="/preferences/create" element={<CreatePreferenceLayout budget={budget} />} />
                            <Route path="/preferences/:id" element={<EditPreferenceLayout budget={budget} />} />
                        </Route>

                    </Route>

                    <Route path="*" element={<NotFoundLayout />} />
                </Route>
            </Routes>

        </FeedbackContext.Provider>
    );
}

export default App;