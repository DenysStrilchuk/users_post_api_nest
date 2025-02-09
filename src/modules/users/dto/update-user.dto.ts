import {IsEmail, IsOptional, IsString, Length, Matches, IsInt, Min, Max} from 'class-validator';

export class UpdateUserDto {
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  @Length(3, 50, {message: 'Name must be between 3 and 50 characters'})
  name?: string;

  @IsInt()
  @IsOptional()
  @Min(18, {message: 'Age must be at least 18'})
  @Max(100, {message: 'Age cannot exceed 100'})
  age?: number;

  @IsString()
  @IsOptional()
  @Matches(/^(male|female|other)$/, {
    message: 'Gender must be "male", "female", or "other"',
  })
  gender?: string;

  @IsString()
  @IsOptional()
  @Length(8, 20, {message: 'Password must be between 8 and 20 characters'})
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/, {
    message: 'Password must include at least one uppercase letter, one lowercase letter, and one number',
  })
  password?: string;
}
