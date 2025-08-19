import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

describe('Erictel API (e2e)', () => {
  let app: INestApplication;
  let mongoServer: MongoMemoryServer;
  let authToken: string;
  let userId: string;
  
  const testUser = {
    email: `eduardo${Date.now()}@test.com`,
    password: 'password123',
    name: 'Eduardo Olimpio',
    description: 'Senior developer with 8 years experience'
  };

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        MongooseModule.forRoot(mongoUri),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    app.setGlobalPrefix('api/v1');
    await app.init();
  });

  afterAll(async () => {
    await app.close();
    await mongoServer.stop();
  });

  describe('Authentication (e2e)', () => {
    it('/auth/register (POST)', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send(testUser)
        .expect(201);

      expect(response.body).toHaveProperty('access_token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe(testUser.email);
      expect(response.body.user.name).toBe(testUser.name);
      expect(response.body.token_type).toBe('Bearer');
      expect(response.body.expires_in).toBe(604800);

      authToken = response.body.access_token;
      userId = response.body.user._id;
    });

    it('/auth/register (POST) - should fail with duplicate email', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send(testUser)
        .expect(409);
    });

    it('/auth/register (POST) - should fail with invalid data', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send({
          email: 'invalid-email',
          password: '123',
          name: ''
        })
        .expect(400);
    });

    it('/auth/login (POST)', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password
        })
        .expect(201);

      expect(response.body).toHaveProperty('access_token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe(testUser.email);
      
      authToken = response.body.access_token;
      userId = response.body.user._id;
    });

    it('/auth/login (POST) - should fail with wrong credentials', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({
          email: testUser.email,
          password: 'wrongpassword'
        })
        .expect(401);
    });
  });

  describe('Users (e2e)', () => {
    it('/users/profile (GET)', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/users/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.email).toBe(testUser.email);
      expect(response.body.name).toBe('Eduardo Olimpio');
    });

    it('/users/profile (GET) - should fail without auth', async () => {
      await request(app.getHttpServer())
        .get('/api/v1/users/profile')
        .expect(401);
    });

    it('/users/profile (PATCH)', async () => {
      const updateData = {
        name: 'Eduardo Olimpio Updated',
        description: 'Updated description with new experience'
      };

      const response = await request(app.getHttpServer())
        .patch('/api/v1/users/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.name).toBe(updateData.name);
      expect(response.body.description).toBe(updateData.description);
    });

    it('/users (GET) - get all users', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/users')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });

    it('/users/:id (GET)', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/v1/users/${userId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.id || response.body._id).toBe(userId);
      expect(response.body.email).toBe(testUser.email);
    });
  });

  describe('Cryptocurrencies (e2e)', () => {
    it('/cryptocurrencies (GET)', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/cryptocurrencies?limit=5')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    it('/cryptocurrencies/top (GET)', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/cryptocurrencies/top?limit=3')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    it('/cryptocurrencies/search (GET)', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/cryptocurrencies/search?q=bitcoin')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    it('/cryptocurrencies/cache (DELETE)', async () => {
      const response = await request(app.getHttpServer())
        .delete('/api/v1/cryptocurrencies/cache')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.message).toContain('cleared');
    });
  });

  describe('Cache Testing (e2e)', () => {
    it('/cache-test/crypto-performance (GET)', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/cache-test/crypto-performance?limit=5')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('success');
      expect(response.body).toHaveProperty('responseTime');
      expect(response.body).toHaveProperty('dataCount');
      expect(response.body.success).toBe(true);
    });

    it('/cache-test/performance-comparison (GET)', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/cache-test/performance-comparison')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('success');
      expect(response.body).toHaveProperty('results');
      expect(response.body).toHaveProperty('performance');
      expect(response.body.results).toHaveLength(2);
      expect(response.body.results[0].type).toBe('CACHE MISS');
      expect(response.body.results[1].type).toBe('CACHE HIT');
    });

    it('/cache-test/cache-info (GET)', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/cache-test/cache-info')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('success');
      expect(response.body).toHaveProperty('cacheStore');
    });

    it('/cache-test/clear-cache (DELETE)', async () => {
      const response = await request(app.getHttpServer())
        .delete('/api/v1/cache-test/clear-cache')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('success');
      expect(response.body.success).toBe(true);
    });
  });

  describe('Debug (e2e)', () => {
    it('/debug/users (GET)', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/debug/users')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('count');
      expect(response.body).toHaveProperty('users');
      expect(response.body).toHaveProperty('message');
      expect(Array.isArray(response.body.users)).toBe(true);
    });
  });
});
