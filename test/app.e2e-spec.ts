import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Users Module (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/users (POST) - should create a new user', async () => {
    const response = await request(app.getHttpServer())
      .post('/users')
      .send({ name: 'John Doe', age: 30 })
      .expect(201);

    expect(response.body).toHaveProperty('name', 'John Doe');
    expect(response.body).toHaveProperty('age', 30);
    expect(response.body).toHaveProperty('id');
  });

  it('/users (GET) - should list users', async () => {
    const response = await request(app.getHttpServer()).get('/users').expect(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('/users/:id (GET) - should get a user by ID', async () => {
    const createUserResponse = await request(app.getHttpServer())
      .post('/users')
      .send({ name: 'Jane Doe', age: 25 });

    const userId = createUserResponse.body.id;

    const response = await request(app.getHttpServer()).get(`/users/${userId}`).expect(200);
    expect(response.body).toHaveProperty('name', 'Jane Doe');
    expect(response.body).toHaveProperty('age', 25);
  });

  it('/users/:id (PUT) - should update a user', async () => {
    const createUserResponse = await request(app.getHttpServer())
      .post('/users')
      .send({ name: 'Mark', age: 40 });

    const userId = createUserResponse.body.id;

    const response = await request(app.getHttpServer())
      .put(`/users/${userId}`)
      .send({ name: 'Mark Updated', age: 41 })
      .expect(200);

    expect(response.body).toHaveProperty('name', 'Mark Updated');
    expect(response.body).toHaveProperty('age', 41);
  });

  it('/users/:id (DELETE) - should delete a user', async () => {
    const createUserResponse = await request(app.getHttpServer())
      .post('/users')
      .send({ name: 'To Delete', age: 22 });

    const userId = createUserResponse.body.id;

    await request(app.getHttpServer()).delete(`/users/${userId}`).expect(204);
  });
});
