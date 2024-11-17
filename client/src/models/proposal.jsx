

export default function Proposal(id, title, budget, accepted, total_preferences, budgetID, createdBy, createdDate, creator) {
    this.id = id;
    this.title = title;
    this.budget = budget;
    this.accepted = accepted;
    this.total_preferences = total_preferences;
    this.budgetID = budgetID;
    this.createdBy = createdBy;
    this.createdDate = createdDate;
    this.creator = creator;

    this.toString = function() {
        return 'Proposal: ' + this.title + ' (' + this.budget + ') ' + this.accepted + ' by ' + this.createdBy;
    }

    
}
