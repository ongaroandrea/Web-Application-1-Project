import dayjs from "dayjs";

// Budget class
// id: number
// year: number
// budget: number
// phase: number 
// createdBy: number
// updatedBy: number
// createdAt: string
// updatedAt: string

export class Budget {
    constructor(id, year, value, phase, createdBy, createdAt, updatedAt) {
      
        this.id = id;
        this.year = year;
        this.value = value;
        this.phase = phase;
        this.createdBy = createdBy;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        
        this.toJSON = () => {
            return {
                ...this
            };
        };
    }
}