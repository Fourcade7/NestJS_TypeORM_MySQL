
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'person',
      autoLoadEntities: true,
      synchronize: true, // faqat o‘rganish uchun
    }),
    //UserModule,
  ],
})
export class DatabaseModule {}