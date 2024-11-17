import Proposal from "../models/proposal";
import User from "../models/user";
import { handleInvalidResponse, SERVER_URL } from "./util/apiUtils";

/**
 * Get all proposals
 * @returns A list of proposals
 */
async function getProposals() {
    return await fetch(SERVER_URL + '/proposals', { credentials: 'include' })
        .then(handleInvalidResponse)
        .then(response => response.json())
        .then(proposals_response => {
            const proposals = proposals_response["data"];
            return proposals.map(proposal => {
                if(proposal.user == null) {
                    return new Proposal(proposal.id, proposal.title, proposal.budget, proposal.accepted, proposal.total_preferences, proposal.budgetID, proposal.createdBy, proposal.createdAt, undefined)
                }
                const user = new User(proposal.user.id, proposal.user.username, undefined, undefined, undefined);
                return new Proposal(proposal.id, proposal.title, proposal.budget, proposal.accepted, proposal.total_preferences, proposal.budgetID, proposal.createdBy, proposal.createdAt, user)
            });
        })
}

/**
 * Get a proposal by ID
 * @param {number} id 
 * @returns A proposal
 */
async function getProposalByID(id) {
    return await fetch(SERVER_URL + '/proposals/' + id, { credentials: 'include' })
        .then(handleInvalidResponse)
        .then(response => response.json())
        .then(proposal_response => {
            const proposal = proposal_response["data"];
            if(proposal.user == null) {
                return new Proposal(proposal.id, proposal.title, proposal.budget, proposal.accepted, proposal.total_preferences, proposal.budgetID, proposal.createdBy, proposal.createdAt, undefined)
            }
            const user = new User(proposal.user.id, proposal.user.username, undefined, undefined, undefined);
            return new Proposal(proposal.id, proposal.title, proposal.budget, proposal.accepted, proposal.total_preferences, proposal.budgetID, proposal.createdBy, proposal.createdAt, user)
        })
}

/**
 * Get all proposals
 * @returns A list of proposals
 */
async function getProposalsNotLoggedUser() {
    return await fetch(SERVER_URL + '/preferences/proposals', { credentials: 'include' })
        .then(handleInvalidResponse)
        .then(response => response.json())
        .then(proposals_response => {
            const proposals = proposals_response["data"];
            return proposals.map(proposal => {
                return new Proposal(proposal.id, proposal.title, proposal.budget, proposal.accepted, proposal.total_preferences, proposal.budgetID, proposal.createdBy, proposal.createdAt, undefined)
            });
        })
}

/**
 * Add a proposal
 * @param {Proposal} proposal 
 * @returns 
 */
async function addProposal(proposal) {
    return await fetch(SERVER_URL + '/proposals', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
            ...proposal
        })
    }).then(handleInvalidResponse)
}

/**
 * Update a proposal
 * @param {Proposal} proposal 
 * @returns 
 */
async function updateProposal(proposal) {
    return await fetch(SERVER_URL + '/proposals/' + proposal.id, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
            ...proposal
        })
    }).then(handleInvalidResponse)
}


async function deleteProposal(proposalId) {
    return await fetch(SERVER_URL + '/proposals/' + proposalId, {
        method: 'DELETE',
        credentials: 'include',
    }).then(handleInvalidResponse)
}

export default { getProposals, getProposalByID, addProposal, updateProposal, deleteProposal, getProposalsNotLoggedUser };
