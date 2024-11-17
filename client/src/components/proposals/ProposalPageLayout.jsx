import { Link, useLocation, useParams } from "react-router-dom";
import FeedbackContext from "../../contexts/FeedbackContext.js";
import NoBudget from "../common/NoBudget.jsx";
import ProposalForm from "./ProposalForm.jsx";
import ProposalList from "./ProposalList.jsx";

import { Col, Row, Form } from "react-bootstrap";
import API from "../../api/api.js";
import { useContext, useEffect } from "react";
import { useState } from "react";
import PropTypes from "prop-types";

export function ProposalListLayout(props) {

    const location = useLocation();
    const { user, budget } = props;
    const { setFeedbackFromError, setShouldRefreshProposals } = useContext(FeedbackContext);
    const [proposals, setProposals] = useState(props.proposals);

    const onDelete = (proposalId) => {
        API.deleteProposal(proposalId)
            .then(() => {
                setShouldRefreshProposals(true);
            })
            .catch(e => setFeedbackFromError(e));
    };

    const onChangeSelection = (e) => {
        switch (e.target.value) {
            case "1":
                setProposals(props.proposals);
                break;
            case "2":
                setProposals(props.proposals.filter(p => p.accepted == true));
                break;
            case "3":
                setProposals(props.proposals.filter(p => p.accepted == false));
                break;
            case "4":
                setProposals(props.proposals.filter(p => p.creator != null && p.creator.id == user.id));
                break;
            default:
                break;
        }
    }

    if (!budget) {
        return <NoBudget />
    }
    let phase = budget.phase;

    if (phase == 3 || phase == 2) {
        return (
            <>
                <Col><h1>Tutte le proposte</h1></Col>
                <Col xs={3} className="my-3">
                    <Form.Select onChange={onChangeSelection}>
                        <option value="1">Tutte le proposte</option>
                        {phase == 3 ? <>
                            <option value="2">Proposte accettate</option>
                            <option value="3">Proposte non accettate</option></>
                            : null}
                        <option value="4">Solo le tue proposte</option>
                    </Form.Select>
                </Col>
                <ProposalList proposals={proposals} user={user} deleteProposal={onDelete} phase3={phase == 3} phase2={phase >= 2} phase1={false} />
            </>
        );
    }
    return (
        <>
            <Row><Col><h1> Tutte le tue proposte</h1></Col><Col className="text-end">
                {phase == 1 ? <Link className="btn btn-primary" to="./create" relative="path"
                    state={{ nextpage: location.pathname }}>
                    Aggiungi proposta
                </Link> : null}
            </Col></Row>
            <ProposalList proposals={props.proposals} user={user} deleteProposal={onDelete} phase1={true} phase2={false} phase3={false}  />
        </>
    );
}

ProposalListLayout.propTypes = {
    proposals: PropTypes.array.isRequired,
    budget: PropTypes.object,
    user: PropTypes.object,
    loggedIn: PropTypes.bool
};

export function EditProposalLayout(props) {
    const { setFeedbackFromError, setShouldRefreshProposals } = useContext(FeedbackContext);
    const { id } = useParams();
    const [editableProposal, setEditableProposal] = useState(null);

    useEffect(() => {
        API.getProposalByID(id)
            .then(proposal => {
                if (proposal.creator.id === props.user.id) {
                    setEditableProposal(proposal);
                }
            })
            .catch(e => {
                setFeedbackFromError(e)}
            );
    });

    if (props.budget.phase != 1) {
        return <>
            <p className="lead">Errore: Impossibile modificare una proposta in questa fase</p>
            <Link className="btn btn-primary mx-auto" to="/" relative="path">Pagina principale!</Link>
        </>
    }

    const updateProposal = (proposal) => {
        if (proposal.title.trim() === '' && proposal.title.length > 100) proposal.title = null;
        if (proposal.budget < 0) proposal.budget = null;
        API.updateProposal(proposal)
            .then(() => setShouldRefreshProposals(true))
            .catch(e => setFeedbackFromError(e));
    };

    return (!editableProposal ?
        <Col>
            <p className="lead">Errore: Proposta non trovata</p>
            <Link className="btn btn-primary mx-auto" to="/" relative="path">Pagina principale!</Link>
        </Col>
        : <ProposalForm proposal={editableProposal} onSubmit={updateProposal} />
    );
}

EditProposalLayout.propTypes = {
    budget: PropTypes.object,
    user: PropTypes.object
};

export function CreateProposalLayout(props) {
    const { setFeedbackFromError, setShouldRefreshProposals } = useContext(FeedbackContext);

    const addProposal = (proposal) => {
        if (proposal.title.trim() === '' && proposal.title.length > 100) proposal.title = null;
        if (proposal.value < 0) proposal.value = null;
        API.addProposal(proposal)
            .then(() => setShouldRefreshProposals(true))
            .catch(e => {
                setFeedbackFromError(e)
            });
    };

    if (!props.budget || props.budget.phase != 1) {
        return <>
            <p className="lead mt-3">Errore: Impossibile creare una proposta in questa fase</p>
            <Link className="btn btn-primary mx-auto" to="../../" relative="path">Pagina principale!</Link>
        </>

    }


    return <ProposalForm onSubmit={addProposal} />;
}

CreateProposalLayout.propTypes = {
    budget: PropTypes.object
};
