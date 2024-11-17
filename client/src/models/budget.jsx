

export default function Budget(id, year, value, phase, createdBy, createdDate, ) {
    this.id = id;
    this.year = year;
    this.value = value;
    this.phase = phase;
    this.createdBy = createdBy;
    this.createdDate = createdDate;
   

    this.toString = function() {
        return 'Budget: ' + this.year + ' (' + this.value + ') ' + this.phase + ' by ' + this.createdBy;
    }
}