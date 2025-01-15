import { STATUS } from "../states/Status.js";

export class ERROR {
  name: string;
  code: number;
  constructor(public message: string, name: string, code: number) {
    this.message = message;
    this.name = name;
    this.code = code;
  }

  static ValidationError(message: string): ValidationError {
    return new ValidationError(message);
  }

  static NotFoundError(message: string): NotFoundError {
    return new NotFoundError(message);
  }
  static ForbiddenError(message: string): ForbiddenError {
    return new ForbiddenError(message);
  }
}

export class ValidationError extends ERROR {
  constructor(message: string) {
    super(message, "ValidationError", STATUS.BAD_REQUEST);
  }
}

export class NotFoundError extends ERROR {
  constructor(message: string) {
    super(message, "NotFoundError", STATUS.NOT_FOUND);
  }
}
export class ForbiddenError extends ERROR {
  constructor(message: string) {
    super(message, "ForbiddenError", STATUS.FORBIDDEN);
  }
}

export class UnauthorizedError extends ERROR {
  constructor(message: string) {
    super(message, "UnauthorizedError", STATUS.UNAUTHORIZED);
  }
}

export class ServiceUnavailable extends ERROR {
  constructor(message: string) {
    super(message, "ServiceUnavailableError", STATUS.SERVICE_UNAVAILABLE);
  }
}

export class GatewayTimeout extends ERROR {
  constructor(message: string) {
    super(message, "GatewayTimeoutError", STATUS.GATEWAY_TIMEOUT);
  }
}

export class UnprocessableEntity extends ERROR {
  constructor(message: string) {
    super(message, "UnprocessableEntityError", STATUS.UNPROCESSABLE_ENTITY);
  }
}
