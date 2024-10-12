import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { DBService } from './db/db.service';
import { DBModule } from './db/db.module';
import { HelloWorldModule } from './hello-world/hello-world.module';

@Module({
  imports: [ConfigModule.forRoot(), DBModule, HelloWorldModule],
  controllers: [],
  providers: [DBService],
})
export class AppModule {}
