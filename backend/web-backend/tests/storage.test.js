import request from 'supertest';
import app from '../server.js';

let token = '';
let facilityId = '';
let vehicleId = '';

describe('Storage & Transport Routes', () => {
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

  // STORAGE FACILITIES

  test('POST /api/storage/facilities - Create new facility', async () => {
    const res = await request(app)
      .post('/api/storage/facilities')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Central Warehouse A',
        district: 'Colombo',
        type: 'Cold Storage',
        capacity: 5000,
        allocated: 1200
      });

    expect(res.status).toBe(201);
    expect(res.body.name).toBe('Central Warehouse A');
    expect(res.body.allocated).toBe(1200);

    facilityId = res.body._id;   // save for later tests
  });

  test('GET /api/storage/facilities - Get all facilities', async () => {
    const res = await request(app)
      .get('/api/storage/facilities')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('PUT /api/storage/facilities/:id - Update allocation (incremental)', async () => {
    const res = await request(app)
      .put(`/api/storage/facilities/${facilityId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ allocated: 800 });   // add 800 more

    expect(res.status).toBe(200);
    expect(res.body.allocated).toBe(2000);   // 1200 + 800
  });

  test('DELETE /api/storage/facilities/:id - Delete facility', async () => {
    const res = await request(app)
      .delete(`/api/storage/facilities/${facilityId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Facility removed');
  });

  // TRANSPORT VEHICLES 

  test('POST /api/storage/vehicles - Create new vehicle', async () => {
    const res = await request(app)
      .post('/api/storage/vehicles')
      .set('Authorization', `Bearer ${token}`)
      .send({
        vehicleId: 'Truck-001',
        district: 'Galle',
        capacity: 10,
        route: 'Galle to Colombo'
      });

    expect(res.status).toBe(201);
    expect(res.body.vehicleId).toBe('Truck-001');

    vehicleId = res.body._id;
  });

  test('GET /api/storage/vehicles - Get all vehicles', async () => {
    const res = await request(app)
      .get('/api/storage/vehicles')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('PUT /api/storage/vehicles/:id - Update vehicle', async () => {
    const res = await request(app)
      .put(`/api/storage/vehicles/${vehicleId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        vehicleId: 'Truck-001',
        district: 'Galle',
        capacity: 12,
        route: 'Galle to Colombo'
      });

    expect(res.status).toBe(200);
    expect(res.body.capacity).toBe(12);
  });

  test('DELETE /api/storage/vehicles/:id - Delete vehicle', async () => {
    const res = await request(app)
      .delete(`/api/storage/vehicles/${vehicleId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Vehicle removed');
  });
});