import request from 'supertest';
import app from '../src/index.js';

describe('Post Endpoints', () => {
  let userId: string;
  let postId: string;

  beforeAll(async () => {
    // Create a user for testing posts
    const userRes = await request(app)
      .post('/api/v1/users')
      .send({
        email: 'author@example.com',
        name: 'Post Author',
      });

    userId = userRes.body.data.id;
  });

  describe('POST /api/v1/posts', () => {
    it('should create a new post', async () => {
      const res = await request(app)
        .post('/api/v1/posts')
        .send({
          title: 'Test Post',
          content: 'This is a test post',
          published: false,
          authorId: userId,
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('id');
      expect(res.body.data.title).toBe('Test Post');

      postId = res.body.data.id;
    });

    it('should reject post without title', async () => {
      const res = await request(app)
        .post('/api/v1/posts')
        .send({
          content: 'Content without title',
          authorId: userId,
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should reject post with invalid authorId', async () => {
      const res = await request(app)
        .post('/api/v1/posts')
        .send({
          title: 'Test Post',
          authorId: '123e4567-e89b-12d3-a456-426614174000',
        });

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/v1/posts', () => {
    it('should get all posts', async () => {
      const res = await request(app).get('/api/v1/posts');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('should filter posts by published status', async () => {
      const res = await request(app).get('/api/v1/posts?published=false');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe('GET /api/v1/posts/:id', () => {
    it('should get post by id', async () => {
      if (!postId) return;

      const res = await request(app).get(`/api/v1/posts/${postId}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe(postId);
    });
  });

  describe('GET /api/v1/posts/author/:authorId', () => {
    it('should get posts by author', async () => {
      const res = await request(app).get(`/api/v1/posts/author/${userId}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  describe('PUT /api/v1/posts/:id', () => {
    it('should update post', async () => {
      if (!postId) return;

      const res = await request(app)
        .put(`/api/v1/posts/${postId}`)
        .send({
          title: 'Updated Post Title',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe('Updated Post Title');
    });
  });

  describe('POST /api/v1/posts/:id/publish', () => {
    it('should publish post', async () => {
      if (!postId) return;

      const res = await request(app).post(`/api/v1/posts/${postId}/publish`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.published).toBe(true);
    });
  });

  describe('POST /api/v1/posts/:id/unpublish', () => {
    it('should unpublish post', async () => {
      if (!postId) return;

      const res = await request(app).post(`/api/v1/posts/${postId}/unpublish`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.published).toBe(false);
    });
  });

  describe('DELETE /api/v1/posts/:id', () => {
    it('should delete post', async () => {
      if (!postId) return;

      const res = await request(app).delete(`/api/v1/posts/${postId}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  afterAll(async () => {
    // Clean up: delete test user
    if (userId) {
      await request(app).delete(`/api/v1/users/${userId}`);
    }
  });
});
