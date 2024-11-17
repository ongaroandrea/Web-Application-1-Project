
export class CustomError extends Error {
    customMessage;
    customCode;

    constructor(customMessage, customCode) {
        super();
        this.customMessage = customMessage;
        this.customCode = customCode;
    }
}