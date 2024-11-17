
import dayjs from "dayjs";

// User class
// id: number
// username: string
// password: string
// email: string
// role: number
// createdBy: number
// updatedBy: number
// createdAt: string
// updatedAt: string

export class User {

    constructor(id, username, password, role, createdAt, updatedAt) {
        this.id = id;
        this.username = username;
        this.password = password;

        this.role = role;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;

        // customize toJSON method to return the object with date only, no time
        this.toJSON = () => {
            return {
                ...this
            };
        };
    }
}
