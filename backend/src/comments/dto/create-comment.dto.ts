import { IsString, IsNotEmpty, IsEmail, Matches } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-zA-Zа-яА-ЯёЁ\s]{2,50}$/, {
    message: 'Имя должно содержать только буквы и быть от 2 до 50 символов'
  })
  authorName: string;

  @IsEmail()
  @IsNotEmpty()
  authorEmail: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^.{10,1000}$/, {
    message: 'Комментарий должен быть от 10 до 1000 символов'
  })
  content: string;
}