

export default function User(id, username, email, role, createdAt) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.role = role;
    this.createdAt = createdAt;

    this.toString = function() {
        return 'User: ' + this.username + ' (' + this.email + ') ' + this.role + ' by ' + this.createdAt;
    }
    
}