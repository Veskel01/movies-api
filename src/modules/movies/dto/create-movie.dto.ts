import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Length,
} from 'class-validator';
import { Genres, MovieDTO } from '../../../shared_types';

export class CreateMovieDTO implements Partial<MovieDTO> {
  @IsString()
  @Length(1, 255)
  @IsNotEmpty()
  public title: string;

  @ArrayMinSize(1)
  @IsArray()
  @IsString({ each: true })
  @IsEnum(Genres, { each: true })
  public genres: Genres[];

  @IsPositive()
  @IsNumber({ allowInfinity: false, allowNaN: false })
  public year: number;

  @IsNumber()
  public runtime: number;

  @IsString()
  @Length(1, 255)
  public director: string;

  @IsString()
  @IsOptional()
  public actors?: string;

  @IsString()
  @IsOptional()
  public plot?: string;

  @IsString()
  @IsOptional()
  public posterUrl?: string;
}
