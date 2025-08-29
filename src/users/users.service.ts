import { Injectable } from '@nestjs/common';
import { DrizzleService } from 'src/database/drizzle.service';
import { eq } from 'drizzle-orm';
import {users} from 'src/database/schema';
@Injectable()
export class UsersService {
  constructor(private drizzleService: DrizzleService) { }

  async findByEmail(email: string) {
    const result = await this.drizzleService.getDb()
      .select()
      .from(users)
      .where(eq(users.email, email.toLowerCase()))
      .limit(1);
    return result[0] || null;
  }


}
