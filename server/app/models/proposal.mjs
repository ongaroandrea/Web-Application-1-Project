// Proposal class
// id: number
// title: string
// budget: number
// accepted: boolean
// total_preferences: number
// budgetID: number
// createdBy: number
// user: User
// updatedBy: number
// createdAt: string
// updatedAt: string

export class Proposal {
    constructor(id, title, budget, accepted, total_preferences, budgetID, createdBy, user, createdAt, updatedAt) {
        this.id = id;
        this.title = title;
        this.budget = budget;
        this.accepted = accepted
        this.total_preferences = total_preferences
        this.budgetID = budgetID;
        this.createdBy = createdBy;
        this.user = user
        this.createdAt = createdAt
        this.updatedAt = updatedAt

        this.toJSON = () => {
            return {
                ...this
            };
        };
    }
}