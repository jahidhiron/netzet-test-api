import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private configService: ConfigService) {
    const dbUser = this.configService.get<string>('database.username');
    const port = this.configService.get<string>('port');
    const dev = this.configService.get<string>('dev');
    const staging = this.configService.get<string>('staging');
    const prod = this.configService.get<string>('prod');
    console.log('DB Username:', dbUser);
    console.log('Port:', port);
    console.log('dev:', dev);
    console.log('staging:', staging);
    console.log('prod:', prod);
  }

  getHello(): string {
    return 'Hello World!';
  }
}
