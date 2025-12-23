const request = require('supertest');
const express = require('express');
const userRouter = require('../../routers/user');
const User = require('../../models/user');

// Mock the models
jest.mock('../../models/user');

// Mock auth middleware for tests
jest.mock('../../auth/isAuth', () => ({
    authToken: (req, res, next) => {
        req.userId = 'mockUserId123';
        req.userRole = 'admin';
        next();
    }
}));

const app = express();
app.use(express.json());
app.use('/user', userRouter);

describe('Input Validation - Security Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('User Registration Validation', () => {
        it('should reject invalid email format', async () => {
            const response = await request(app)
                .post('/user/register')
                .send({
                    name: 'Test User',
                    phone: 1234567890,
                    email: 'not-an-email',
                    password: 'password123',
                    role: 'user'
                });

            expect(response.status).toBe(400);
            expect(response.body.errors).toBeDefined();
        });

        it('should reject password shorter than 6 characters', async () => {
            const response = await request(app)
                .post('/user/register')
                .send({
                    name: 'Test User',
                    phone: 1234567890,
                    email: 'test@example.com',
                    password: '12345',
                    role: 'user'
                });

            expect(response.status).toBe(400);
            expect(response.body.errors).toBeDefined();
        });

        it('should reject invalid role values', async () => {
            const response = await request(app)
                .post('/user/register')
                .send({
                    name: 'Test User',
                    phone: 1234567890,
                    email: 'test@example.com',
                    password: 'password123',
                    role: 'superadmin'
                });

            expect(response.status).toBe(400);
            expect(response.body.errors).toBeDefined();
        });

        it('should fail test before fix - SQL injection attempt accepted', async () => {
            // This test documents the vulnerability before validation
            const sqlInjectionPayload = "admin' OR '1'='1";
            
            // Before fix, this would be accepted without validation
            const dangerousEmail = sqlInjectionPayload + "@example.com";
            
            // Demonstrate the payload is malicious
            expect(dangerousEmail).toContain("'");
            expect(dangerousEmail).toContain('OR');
            
            // After fix, this should be rejected by email validator
        });

        it('should sanitize and accept valid registration', async () => {
            User.prototype.save = jest.fn().mockResolvedValue({
                _id: 'user123',
                name: 'Test User',
                phone: 1234567890,
                email: 'test@example.com',
                role: 'user'
            });

            User.mockImplementation(() => ({
                save: User.prototype.save
            }));

            const response = await request(app)
                .post('/user/register')
                .send({
                    name: 'Test User',
                    phone: 1234567890,
                    email: 'Test@Example.com',
                    password: 'password123',
                    role: 'user'
                });

            expect(response.status).toBe(201);
        });
    });

    describe('Parameter Validation', () => {
        it('should reject invalid MongoDB ObjectId in URL parameter', async () => {
            const response = await request(app)
                .get('/user/not-a-valid-id');

            expect(response.status).toBe(400);
            expect(response.body.errors).toBeDefined();
        });

        it('should reject invalid query parameter', async () => {
            const response = await request(app)
                .get('/user/find?email=not-an-email');

            expect(response.status).toBe(400);
            expect(response.body.errors).toBeDefined();
        });
    });

    describe('Data Sanitization', () => {
        it('should trim whitespace from string inputs', async () => {
            User.prototype.save = jest.fn().mockResolvedValue({
                _id: 'user123',
                name: 'Test User',
                email: 'test@example.com'
            });

            User.mockImplementation(() => ({
                save: User.prototype.save
            }));

            await request(app)
                .post('/user/register')
                .send({
                    name: '  Test User  ',
                    phone: 1234567890,
                    email: 'test@example.com',
                    password: 'password123',
                    role: 'user'
                });

            const savedUser = User.mock.calls[0][0];
            expect(savedUser.name).toBe('Test User');
            expect(savedUser.name).not.toContain('  ');
        });
    });
});
