import React from "react";

const FeedbackContext = React.createContext({
    setFeedback: () => {},
    setFeedbackFromError: () => {},
    setShouldRefreshBudget: () => {},
    setShouldRefreshProposals: () => {},
    setShouldRefreshPreferences: () => {},
});

export default FeedbackContext;