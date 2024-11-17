import Preference from "../models/preference";
import Proposal from "../models/proposal";
import { handleInvalidResponse, SERVER_URL } from "./util/apiUtils";

/**
 * Get all preferences
 * @returns A list of preferences
 */
async function getPreferences() {
    return await fetch(SERVER_URL + '/preferences', { credentials: 'include' })
        .then(handleInvalidResponse)
        .then(response => response.json())
        .then(preferences => preferences["data"].map(preference => {
            const proposal = new Proposal(preference.proposal.id, preference.proposal.title, preference.proposal.budget, preference.proposal.accepted, preference.proposal.budgetID, preference.proposal.createdBy, preference.proposal.createAt);
            return new Preference(preference.id, preference.value, preference.proposalID, preference.createdBy, preference.createdAt, proposal);
        }))
}

/**
 * Add a preference
 * @param {Preference} preference 
 * @returns
 */
async function addPreference(preference) {
    return await fetch(SERVER_URL + '/preferences', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
            ...preference
        })
    }).then(handleInvalidResponse)
}

/**
 * Get a preference by ID
 * @param {number} preferenceID 
 * @returns A preference
 */
async function getPreferenceByID(preferenceID) {
    return await fetch(SERVER_URL + '/preferences/' + preferenceID, { credentials: 'include' })
        .then(handleInvalidResponse)
        .then(response => response.json())
        .then(preference_responsee => {
            const preference = preference_responsee["data"];
            const proposal = new Proposal(preference.proposal.id, preference.proposal.title, preference.proposal.budget, preference.proposal.accepted, preference.proposal.budgetID, preference.proposal.createdBy, preference.proposal.createAt);
            return new Preference(preference.id, preference.value, preference.proposalID, preference.createdBy, preference.createdAt, proposal);
        })
}

/**
 * Update a preference
 * @param {Preference} preference 
 * @returns
 */
async function updatePreference(preference) {
    return await fetch(SERVER_URL + '/preferences/' + preference.id, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
            ...preference
        })
    }).then(handleInvalidResponse)
}

/**
 * Delete a preference
 * @param {number} preferenceId 
 * @returns 
 */
async function deletePreference(preferenceId) {
    return await fetch(SERVER_URL + '/preferences/' + preferenceId, {
        method: 'DELETE',
        credentials: 'include',
    }).then(handleInvalidResponse)
}



export default { getPreferences, getPreferenceByID, addPreference, updatePreference, deletePreference };