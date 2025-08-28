import { Injectable } from '@nestjs/common';
import { DrizzleService } from 'src/database/drizzle.service';
import { eq } from 'drizzle-orm';
import {users} from 'src/database/schema';
@Injectable()
export class UsersService {
  constructor(private drizzleService: DrizzleService) { }

  

}
