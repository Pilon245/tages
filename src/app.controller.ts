import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('start')
  async sortFile() {
    return this.appService.sortFile();
  }

  @Get('create')
  async createFile() {
    return this.appService.createFile();
  }
}
