import request from 'supertest';
import app from '../src/index.js';

describe('User Endpoints', () => {
  let userId: string;

  describe('POST /api/v1/users', () => {
    it('should create a new user', async () => {
      const res = await request(app)
        .post('/api/v1/users')
        .send({
          email: 'test@example.com',
          name: 'Test User',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('id');
      expect(res.body.data.email).toBe('test@example.com');
      expect(res.body.data.name).toBe('Test User');

      userId = res.body.data.id;
    });

    it('should reject invalid email', async () => {
      const res = await request(app)
        .post('/api/v1/users')
        .send({
          email: 'invalid-email',
          name: 'Test User',
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should reject missing name', async () => {
      const res = await request(app)
        .post('/api/v1/users')
        .send({
          email: 'test@example.com',
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/v1/users', () => {
    it('should get all users', async () => {
      const res = await request(app).get('/api/v1/users');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  describe('GET /api/v1/users/:id', () => {
    it('should get user by id', async () => {
      if (!userId) return;

      const res = await request(app).get(`/api/v1/users/${userId}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe(userId);
    });

    it('should return 404 for non-existent user', async () => {
      const fakeId = '123e4567-e89b-12d3-a456-426614174000';
      const res = await request(app).get(`/api/v1/users/${fakeId}`);

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  describe('PUT /api/v1/users/:id', () => {
    it('should update user', async () => {
      if (!userId) return;

      const res = await request(app)
        .put(`/api/v1/users/${userId}`)
        .send({
          name: 'Updated Name',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe('Updated Name');
    });
  });

  describe('DELETE /api/v1/users/:id', () => {
    it('should delete user', async () => {
      if (!userId) return;

      const res = await request(app).delete(`/api/v1/users/${userId}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });
});
