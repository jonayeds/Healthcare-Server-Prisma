export class ApiError extends Error {
  statusCode: number;
  stack?: string;
  constructor(statusCode: number, string: string, stack = "") {
    super(string);
    this.statusCode = statusCode;
    if(stack){
        this.stack = stack;
    }else{
        Error.captureStackTrace(this, this.constructor)
    }
  }
}
