import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './app.module';

let app: INestApplication;
let server: any;
let api: request.SuperTest<request.Test>;

beforeAll(async () => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  app = moduleFixture.createNestApplication();
  await app.init();
  server = app.getHttpServer();
  api = request(server);
});

afterAll(async () => {
  await app.close();
});

describe('AppController (e2e)', () => {
  test('/create add string File', () => {
    return api.get('/create').expect(200).expect('Ok');
  }, 100000);
  test('/start run sort File', () => {
    return api.get('/start').expect(200).expect('Ok');
  }, 300000);
});
