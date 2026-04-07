import request from 'supertest';
import app from '../server.js';

let token = '';
let scheduleId = '';

describe('Harvest Schedules Routes', () => {
  beforeAll(async () => {
    // Login once to get token
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'officer1',
        password: 'officer@2025'
      });

    token = loginRes.body.token;
  });

  test('POST /api/harvest/schedules - Create new schedule', async () => {
    const res = await request(app)
      .post('/api/harvest/schedules')
      .set('Authorization', `Bearer ${token}`)
      .send({
        crop: 'Tomato',
        district: 'Colombo',
        plantingDate: '2025-04-01',
        harvestDate: '2025-07-15',
        area: 25,
        expectedYield: 45
      });

    expect(res.status).toBe(201);
    expect(res.body.crop).toBe('Tomato');
    expect(res.body.district).toBe('Colombo');

    scheduleId = res.body._id;   // save ID for later tests
  });

  test('GET /api/harvest/schedules - Get all schedules', async () => {
    const res = await request(app)
      .get('/api/harvest/schedules')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('PUT /api/harvest/schedules/:id - Update schedule', async () => {
    const res = await request(app)
      .put(`/api/harvest/schedules/${scheduleId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        crop: 'Tomato',
        district: 'Colombo',
        plantingDate: '2025-04-05',
        harvestDate: '2025-07-20',
        area: 30,
        expectedYield: 48
      });

    expect(res.status).toBe(200);
    expect(res.body.area).toBe(30);
    expect(res.body.expectedYield).toBe(48);
  });

  test('DELETE /api/harvest/schedules/:id - Delete schedule', async () => {
    const res = await request(app)
      .delete(`/api/harvest/schedules/${scheduleId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Schedule removed');
  });
});