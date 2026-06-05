const request = require('supertest');
const app = require('../src/app');
const testDb = require('./testDb');

beforeAll(async () => await testDb.connect());
afterEach(async () => await testDb.clearDatabase());
afterAll(async () => await testDb.closeDatabase());

describe('Todos Endpoints', () => {
  let token;

  beforeEach(async () => {
    // Register and login a user to get a token
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'todouser',
        password: 'password123',
      });
    token = res.body.token;
  });

  it('should not allow unauthorized access to GET /api/todos', async () => {
    const res = await request(app).get('/api/todos');
    expect(res.statusCode).toEqual(401);
  });

  it('should create a new todo', async () => {
    const res = await request(app)
      .post('/api/todos')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Test Todo' });
    
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('title', 'Test Todo');
    expect(res.body).toHaveProperty('completed', false);
  });

  it('should get user todos', async () => {
    await request(app)
      .post('/api/todos')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Test Todo 1' });

    const res = await request(app)
      .get('/api/todos')
      .set('Authorization', `Bearer ${token}`);
      
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toEqual(1);
  });
});
