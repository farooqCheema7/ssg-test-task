import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DBService } from './db/db.service';
import { DBModule } from './db/db.module';
import { HelloWorldModule } from './hello-world/hello-world.module';
import { AuthModule } from './auth/auth.module';
import { TaskModule } from './task/task.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    DBModule,
    HelloWorldModule,
    AuthModule,
    TaskModule,
  ],
  controllers: [],
  providers: [DBService],
})
export class AppModule {}
