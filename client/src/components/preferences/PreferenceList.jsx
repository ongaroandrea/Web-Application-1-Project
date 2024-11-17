import PropTypes from 'prop-types';
import { Table } from 'react-bootstrap/';
import { Link, useLocation } from "react-router-dom";

export default function PreferenceList(props) {

    const { actions, deletePreference, preferences } = props;
    return (
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>#</th>
                    <th>Titolo proposta</th>
                    <th>Budget proposta</th>
                    <th>Valutazione</th>
                    {actions ? <th>Azioni</th> : null}
                </tr>
            </thead>
            <tbody>
                {preferences.length === 0 ?
                    <tr><td colSpan="5">Nessuna preferenza espressa</td></tr> :
                    preferences.map((preference) => 
                <PreferenceInList key={preference.id} preferenceData={preference} actions={actions}  deletePreference={deletePreference} />)}
            </tbody>
        </Table>
    );
}

PreferenceList.propTypes = {
    preferences: PropTypes.array,
    actions: PropTypes.bool,
    deletePreference: PropTypes.func
};


export function PreferenceInList(props) {

    const { preferenceData, actions, deletePreference } = props;
    return (
        <tr>
            <td>{preferenceData.id}</td>
            <td>{preferenceData.proposal.title}</td>
            <td>{preferenceData.proposal.budget}</td>
            <td>{preferenceData.value}</td>
            {actions ? <td><PreferenceIcons preferenceData={preferenceData} deletePreference={deletePreference} /> </td> : null}
        </tr>
    );
}


PreferenceInList.propTypes = {
    preferenceData: PropTypes.object.isRequired,
    actions: PropTypes.bool,
    deletePreference: PropTypes.func.isRequired
};

function PreferenceIcons(props) {
    const location = useLocation();
    const { preferenceData, deletePreference } = props;
    return (<>
        <Link className="bi bi-pencil" to={"./" + preferenceData.id} state={{ nextpage: location.pathname }} />
        <i className="bi bi-trash" onClick={() => deletePreference(preferenceData.id)} />
    </>);
}

PreferenceIcons.propTypes = {
    preferenceData: PropTypes.object.isRequired,
    deletePreference: PropTypes.func.isRequired
};
