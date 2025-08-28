import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import {DrizzleModule} from'src/database/drizzle.module';
@Module({
  imports: [DrizzleModule],
  controllers: [ ],
  providers: [UsersService],
})
export class UsersModule {}
