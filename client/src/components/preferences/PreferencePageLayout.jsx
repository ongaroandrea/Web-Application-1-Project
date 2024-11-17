/* eslint-disable react/prop-types */
import { useContext, useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import NoBudget from "../common/NoBudget.jsx";
import PreferenceForm from "./PreferenceForm.jsx";
import PreferenceList from "./PreferenceList.jsx";
import FeedbackContext from "../../contexts/FeedbackContext.js";
import API from "../../api/api.js";

export function PreferenceListLayout(props) {

    const { setFeedbackFromError, setShouldRefreshPreferences } = useContext(FeedbackContext);
    const { budget, shouldRefreshPreferences } = props;
    const [preferences, setPreferences] = useState([]);

    useEffect(() => {
        if(!budget) setPreferences([]);
        API.getPreferences()
            .then(preferences => {
                setPreferences(preferences)
            })
            .then(() => {
                setShouldRefreshPreferences(false);
            })
            .catch(() => {
                setPreferences([]);
                setShouldRefreshPreferences(false);
            });
    }, [shouldRefreshPreferences, budget]);

    const onDelete = (preferenceID) => {
        API.deletePreference(preferenceID)
            .then(() => setShouldRefreshPreferences(true))
            .catch(e => setFeedbackFromError(e));
    };


    const onUpdateRating = (preferenceID, nextRating) => {
        API.updatePreference(preferenceID, nextRating)
            .then(() => setShouldRefreshPreferences(true))
            .catch(e => setFeedbackFromError(e));
    }


    if (!budget) {
        return <NoBudget />
    }

    return (
        <> <Row>
            <Col>
                <h1>Tutte le tue preferenze</h1>
            </Col>
            <Col className="text-end">
                {budget.phase == 2 ? <Link className="btn btn-primary" to="./create" relative="path">Aggiungi preferenza</Link> : null}
            </Col>
        </Row>
            {budget.phase == 2 ? <p className="lead">Puoi modificare le preferenze solo durante la fase di valutazione. Inseriscile ora!</p> : <span>Non ti è più permesso di inserire preferenze</span>}
            <PreferenceList preferences={preferences} actions={props.budget.phase == 2} updatePreferenceValue={onUpdateRating} deletePreference={onDelete} />
        </>
    );
}

export function EditPreferenceLayout(props) {
    const { id } = useParams();
    const [editablePreferences, setEditablePreference] = useState(false);

    const { setFeedbackFromError, setShouldRefreshPreferences } = useContext(FeedbackContext);

    useEffect(() => {
        API.getPreferenceByID(id)
            .then(preference => {
                setEditablePreference(preference);
            })
            .catch(e => setFeedbackFromError(e));
    }, []);

    if (props.budget.phase != 2) {
        return <>
            <p className="lead">Errore: Impossibile modificare una preferenza in questa fase</p>
            <Link className="btn btn-primary mx-auto" to="../../" relative="path">Pagina principale!</Link>
        </>
    }

    const updatePreference = (preference) => {
        if (preference.value < 0) preference.value = null;
        API.updatePreference(preference)
            .then(() => setShouldRefreshPreferences(true))
            .catch(e => setFeedbackFromError(e));
    };
    
    return (!editablePreferences ?
        <Col>
            <p className="lead">Errore: Preferenza non trovata</p>
            <Link className="btn btn-primary mx-auto" to="../../" relative="path">Pagina principale</Link>
        </Col>
        : <Col><PreferenceForm preference={editablePreferences} onSubmit={updatePreference} /></Col>
    );
}

export function CreatePreferenceLayout(props) {
    const { setFeedbackFromError, setShouldRefreshPreferences } = useContext(FeedbackContext);
    const [proposals, setProposal] = useState([]);

    useEffect(() => {
        API.getProposalsNotLoggedUser()
            .then(proposals => {
                setProposal(proposals);
            })
            .catch(e => setFeedbackFromError(e));
    }, []);

    const addProposal = (preference) => {
        if (preference.value < 0) preference.value = null;
        API.addPreference(preference)
            .then(() => setShouldRefreshPreferences(true))
            .catch(e => setFeedbackFromError(e));
    };

    if (!props.budget || props.budget.phase != 2) {
        return <>
            <p className="lead">Errore: Impossibile creare una preferenza in questa fase</p>
            <Link className="btn btn-primary mx-auto" to="../../" relative="path">Pagina principale!</Link>
        </>
    }

    return <PreferenceForm onSubmit={addProposal} proposals={proposals} />;
}