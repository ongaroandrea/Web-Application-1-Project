// Preference class
// id: number
// value: string
// proposalID: number
// createdBy: number
// updatedBy: number
// createdAt: string
// updatedAt: string
// proposal: Proposal

export class Preference {

    constructor(id, value, proposalID, createdBy, createdAt, updatedAt, proposal) {
        this.id = id;
        this.value = value;
        this.proposalID = proposalID;
        this.createdBy = createdBy;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.proposal = proposal

        this.toJSON = () => {
            return {
                ...this
            };
        };
    }

    
}