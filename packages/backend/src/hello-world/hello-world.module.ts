import { Module } from '@nestjs/common';
import { HelloWorldController } from './hello-world.controller';
import { HelloWorldService } from './hello-world.service';
import { DBService } from '@/db/db.service';

@Module({
  controllers: [HelloWorldController],
  providers: [HelloWorldService, DBService],
})
export class HelloWorldModule {}
