

export default function Preference(id, value, proposalID, createdBy, createdAt, proposal) {
    this.id = id;
    this.value = value;
    this.proposalID = proposalID;
    this.createdBy = createdBy;
    this.createdAt = createdAt;
    this.proposal = proposal

    this.toString = function() {
        return 'Preference: ' + this.value + ' by ' + this.createdBy;
    }
}