import proposals from './proposals';
import auth from './auth';
import preferences from './preferences';
import budgets from './budgets';


const API = {
    ...auth,
    ...proposals,
    ...preferences,
    ...budgets
};

export default API;