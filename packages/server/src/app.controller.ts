import { Get, Controller, Param, Post, Body } from '@nestjs/common';

import * as path from 'path';
import * as fs from 'fs';
import { AppService } from './app.service';

@Controller()
export class AppController {

  constructor(private readonly catsService: AppService) {}

  @Get()
  root(): string {
    return 'Hello, Dynamisch Draaiboek!';
  }
  @Get('version')
  version(): string {
    return 'v0.0.1';
  }

 

}
