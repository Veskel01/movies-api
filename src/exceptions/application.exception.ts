import { HttpException, HttpStatus } from '@nestjs/common';

export interface ApplicationExceptionBody {
  message: string;
  messageFormat: string;
  messageArgs: unknown[];
  statusCode: HttpStatus;
}

export class ApplicationException extends HttpException {
  constructor(args: ApplicationExceptionBody) {
    super(args, args.statusCode);
  }

  public get statusCode(): number {
    return this.getStatus();
  }

  public get messageFormat(): string {
    const { messageFormat } = super.getResponse() as ApplicationExceptionBody;

    return messageFormat;
  }

  public get messageArgs(): unknown[] {
    const { messageArgs } = super.getResponse() as ApplicationExceptionBody;

    return messageArgs;
  }
}
