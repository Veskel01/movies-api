import {
  ArgumentsHost,
  Catch,
  ExceptionFilter as NestExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';

import { ApplicationExceptionBody } from '../../exceptions';

import { Request, Response } from 'express';

import { DateTime } from 'luxon';

// models error
@Catch(HttpException, Error)
export class ExceptionFilter implements NestExceptionFilter {
  private readonly logger = new Logger(ExceptionFilter.name);

  private readonly defaultErrorMessage = 'Internal Application Error';

  private readonly defaultStatusCode = 500;

  private readonly defaultMesssagFormat: string = '';

  private readonly defaultMessageArgs: unknown[] = [];

  public catch(exception: HttpException | Error, host: ArgumentsHost): void {
    const context = host.switchToHttp();
    const request = context.getRequest<Request>();
    const response = context.getResponse<Response>();
    let errorResponseBody: ApplicationExceptionBody = {
      statusCode: this.defaultStatusCode,
      message: this.defaultErrorMessage,
      messageArgs: this.defaultMessageArgs,
      messageFormat: this.defaultMesssagFormat,
    };

    if (exception instanceof HttpException) {
      const httpStatus = exception.getStatus();

      const errorBody = exception.getResponse() as ApplicationExceptionBody;

      errorResponseBody = {
        ...errorBody,
        statusCode: httpStatus,
      };
    } else {
      this.logger.error(exception.message, exception?.stack);
      errorResponseBody.message = exception.message;
    }
    const { statusCode, ...rest } = errorResponseBody;

    response.status(statusCode).send({
      statusCode,
      ...rest,
      timestamp: DateTime.local().toJSDate(),
      path: request.path,
    });
  }
}
