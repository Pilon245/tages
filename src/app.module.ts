import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Files } from './file.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Files]),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '1234',
      database: 'tages',
      // ssl: true,
      autoLoadEntities: true, // автоматически делает изменения
      synchronize: true, // true  во время разработки
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
