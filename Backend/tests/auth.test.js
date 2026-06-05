const request = require('supertest');
const app = require('../src/app');
const testDb = require('./testDb');
const User = require('../src/models/User');

beforeAll(async () => await testDb.connect());
afterEach(async () => await testDb.clearDatabase());
afterAll(async () => await testDb.closeDatabase());

describe('Auth Endpoints', () => {
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'testuser',
        password: 'password123',
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body).toHaveProperty('username', 'testuser');
  });

  it('should not register user if username already exists', async () => {
    await User.create({ username: 'testuser', password: 'password123' });
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'testuser',
        password: 'password123',
      });
    expect(res.statusCode).toEqual(400);
  });

  it('should login a user', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({
        username: 'loginuser',
        password: 'password123',
      });

    const res = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'loginuser',
        password: 'password123',
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });

  it('should not login with wrong credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'nouser',
        password: 'password123',
      });
    expect(res.statusCode).toEqual(401);
  });
});
