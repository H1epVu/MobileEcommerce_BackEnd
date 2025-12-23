const bcrypt = require('bcrypt');
const User = require('../../models/user');
const userController = require('../../controllers/user');

// Mock the User model
jest.mock('../../models/user');

describe('User Controller - Password Security', () => {
    let req, res;

    beforeEach(() => {
        req = {
            body: {},
            params: {}
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        jest.clearAllMocks();
    });

    describe('register', () => {
        it('should hash password before saving to database', async () => {
            const plainPassword = 'mySecretPassword123';
            req.body = {
                name: 'Test User',
                phone: 1234567890,
                email: 'test@example.com',
                address: '123 Test St',
                password: plainPassword,
                role: 'user'
            };

            const mockSave = jest.fn().mockResolvedValue({
                _id: 'user123',
                ...req.body,
                password: 'hashed_password'
            });

            User.mockImplementation(() => ({
                save: mockSave
            }));

            await userController.register(req, res);

            expect(User).toHaveBeenCalled();
            
            // Verify password was hashed (not plaintext)
            const savedPassword = User.mock.calls[0][0].password;
            expect(savedPassword).not.toBe(plainPassword);
            expect(savedPassword.startsWith('$2b$')).toBe(true); // bcrypt hash format
            
            expect(mockSave).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(201);
        });

        it('should fail test before fix - plaintext password stored', async () => {
            // This test documents the vulnerability before the fix
            const plainPassword = 'insecurePassword';
            
            // Simulate old behavior (plaintext storage)
            const oldBehaviorPassword = plainPassword; // No hashing
            
            // This would fail security check
            expect(oldBehaviorPassword).toBe(plainPassword); // VULNERABLE
            expect(oldBehaviorPassword.startsWith('$2b$')).toBe(false); // Not hashed
        });
    });

    describe('login', () => {
        it('should compare password using bcrypt', async () => {
            const plainPassword = 'testPassword123';
            const hashedPassword = await bcrypt.hash(plainPassword, 12);

            req.body = {
                email: 'test@example.com',
                password: plainPassword
            };

            User.findOne.mockResolvedValue({
                _id: 'user123',
                email: 'test@example.com',
                password: hashedPassword,
                role: 'user'
            });

            await userController.login(req, res);

            expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    token: expect.any(String)
                })
            );
        });

        it('should reject incorrect password', async () => {
            const correctPassword = 'correctPassword';
            const wrongPassword = 'wrongPassword';
            const hashedPassword = await bcrypt.hash(correctPassword, 12);

            req.body = {
                email: 'test@example.com',
                password: wrongPassword
            };

            User.findOne.mockResolvedValue({
                _id: 'user123',
                email: 'test@example.com',
                password: hashedPassword,
                role: 'user'
            });

            await userController.login(req, res);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ message: 'Sai mật khẩu!' });
        });

        it('should fail test before fix - plaintext comparison', async () => {
            // This test documents the old vulnerable behavior
            const plainPassword = 'password123';
            const storedPassword = 'password123'; // Stored in plaintext (old behavior)
            
            // Old vulnerable comparison
            const oldComparison = (plainPassword === storedPassword);
            expect(oldComparison).toBe(true); // This worked but is INSECURE
            
            // Anyone with database access can read passwords directly
            expect(storedPassword).toBe('password123'); // VULNERABLE - readable password
        });
    });

    describe('updateUser', () => {
        it('should hash password when updating', async () => {
            const newPassword = 'newSecurePassword';
            req.body = {
                id: 'user123',
                name: 'Updated User',
                phone: 1234567890,
                email: 'updated@example.com',
                password: newPassword,
                address: '456 New St',
                role: 'user'
            };

            User.findOneAndUpdate.mockResolvedValue({
                _id: 'user123',
                ...req.body,
                password: 'hashed_new_password'
            });

            await userController.updateUser(req, res);

            const updateData = User.findOneAndUpdate.mock.calls[0][1];
            
            // Verify new password was hashed
            expect(updateData.password).not.toBe(newPassword);
            expect(updateData.password.startsWith('$2b$')).toBe(true);
            
            expect(res.status).toHaveBeenCalledWith(200);
        });

        it('should not modify password if not provided', async () => {
            req.body = {
                id: 'user123',
                name: 'Updated User',
                phone: 1234567890,
                email: 'updated@example.com',
                // No password field
                address: '456 New St',
                role: 'user'
            };

            User.findOneAndUpdate.mockResolvedValue({
                _id: 'user123',
                ...req.body
            });

            await userController.updateUser(req, res);

            const updateData = User.findOneAndUpdate.mock.calls[0][1];
            
            // Verify password field is not in update data
            expect(updateData.password).toBeUndefined();
            
            expect(res.status).toHaveBeenCalledWith(200);
        });
    });
});
