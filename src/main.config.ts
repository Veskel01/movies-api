import {
  ExceptionFilter as NestExceptionFilter,
  HttpStatus,
  PipeTransform,
  ValidationPipe,
} from '@nestjs/common';
import { ExceptionFilter } from './common';
import { ApplicationException } from './exceptions';

interface Globals {
  filters: NestExceptionFilter[];
  pipes: PipeTransform[];
}

export const getGlobalProperties = (): Globals => {
  const globalFilters = [new ExceptionFilter()];

  const validationPipe = new ValidationPipe({
    stopAtFirstError: true,
    exceptionFactory: (validationErrors): ApplicationException => {
      const [error] = validationErrors;

      const { property, constraints } = error;

      const firstErrorMessage = Object.values(constraints || {})[0];

      return new ApplicationException({
        message: `Validation error in property: ${property} - ${firstErrorMessage}`,
        messageArgs: [property, firstErrorMessage],
        messageFormat: 'Validation error in property: %s - %s',
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      });
    },
  });

  const globalPipes = [validationPipe];

  return {
    filters: globalFilters,
    pipes: globalPipes,
  };
};
