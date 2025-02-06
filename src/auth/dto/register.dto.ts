import {IsEmail, IsString, Matches, MinLength} from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d]{8,}$/, {
    message: 'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, and one number',
  })
  password: string;
}
