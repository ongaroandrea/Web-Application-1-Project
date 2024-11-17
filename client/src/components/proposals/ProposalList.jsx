import PropTypes from 'prop-types';
import { Link, useLocation } from "react-router-dom";
import Table from 'react-bootstrap/Table';

export default function ProposalList(props) {

    const { phase1, phase2, phase3, user, proposals, deleteProposal } = props;
    return (
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>#</th>
                    <th>Descrizione</th>
                    <th>Budget (in €)</th>
                    {phase3 && user != undefined ? <th>Accettato</th> : null}
                    {phase2 ? <th>Inserita da</th> : null}
                    {phase1 ? <th>Azioni</th> : null}
                    {phase3 ? <th>Preferenze inserite</th> : null}
                </tr>
            </thead>
            <tbody>
                {!proposals || proposals.length === 0 ? <tr><td colSpan="6">Nessuna proposta presente</td></tr> : null}
                {proposals.map((proposal) => <ProposalInList
                    key={proposal.id}
                    proposalData={proposal}
                    phase1={phase1}
                    phase2={phase2}
                    phase3={phase3}
                    deleteProposal={deleteProposal}
                    user={user}
                />)}
            </tbody>
        </Table>
    );
}

ProposalList.propTypes = {
    proposals: PropTypes.array.isRequired,
    user: PropTypes.object,
    phase1: PropTypes.bool.isRequired,
    phase2: PropTypes.bool.isRequired,
    phase3: PropTypes.bool.isRequired,
    deleteProposal: PropTypes.func
};

function ProposalInList(props) {
    const { phase1, phase2, phase3, user, proposalData, deleteProposal } = props;
    return (
        <tr>
            <td>{proposalData.id}</td>
            <td>{proposalData.title}</td>
            <td>{proposalData.budget}</td>
            {phase3 && user != undefined ? <td>{proposalData.accepted ? "YES" : "NO"}</td> : null}
            {phase2 ? <td>{proposalData.creator != null ? proposalData.creator.username : "Non disponibile"}</td> : null}

            {phase1 ? <td><ProposalIcons proposalData={proposalData} deleteProposal={deleteProposal} /> </td> : null}
            {phase3 ? <td>{proposalData.total_preferences}</td> : null}
        </tr>
    );
}

ProposalInList.propTypes = {
    proposalData: PropTypes.object.isRequired,
    deleteProposal: PropTypes.func,
    user: PropTypes.object,
    phase1: PropTypes.bool.isRequired,
    phase2: PropTypes.bool.isRequired,
    phase3: PropTypes.bool.isRequired
};

function ProposalIcons(props) {
    const location = useLocation();
    const { proposalData, deleteProposal } = props;
    return (<>
        <Link className="bi bi-pencil" to={"./" + proposalData.id} state={{ nextpage: location.pathname }} />
        <i className="bi bi-trash" onClick={() => deleteProposal(proposalData.id)} />
    </>);
}

ProposalIcons.propTypes = {
    proposalData: PropTypes.object.isRequired,
    deleteProposal: PropTypes.func.isRequired
};
