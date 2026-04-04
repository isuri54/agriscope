import request from 'supertest';
import app from '../server.js';

describe('Auth Routes', () => {
  test('POST /api/auth/login - successful login', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'officer1',
        password: 'officer@2025'
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user.username).toBe('officer1');
  });

  test('POST /api/auth/login - wrong password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'officer1',
        password: 'wrongpassword'
      });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Invalid credentials');
  });
});