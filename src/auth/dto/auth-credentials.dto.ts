import { IsString, MinLength, MaxLength, Matches } from 'class-validator';

export class AuthCredentialsDto {
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  username: string;

  @IsString()
  @MinLength(8)
  @MaxLength(32)
  @Matches(/(?:(?=.*\d)(?=.*[A-Z])(?=.*\W).*)/, {
    message: 'Password must contain at least 1 upper case letter, 1 number and 1 special character',
  })
  password: string;
}

