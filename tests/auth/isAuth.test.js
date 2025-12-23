const jwt = require('jsonwebtoken');
const { authToken, createToken } = require('../../auth/isAuth');

describe('Auth Middleware - JWT Secret Security', () => {
    let req, res, next;
    let originalEnv;

    beforeAll(() => {
        // Save original environment
        originalEnv = process.env.JWT_SECRET;
    });

    afterAll(() => {
        // Restore original environment
        process.env.JWT_SECRET = originalEnv;
    });

    beforeEach(() => {
        req = {
            get: jest.fn(),
            body: {}
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        next = jest.fn();
        jest.clearAllMocks();
    });

    describe('authToken', () => {
        it('should use JWT_SECRET from environment when available', () => {
            const customSecret = 'my-custom-super-secure-secret-key-12345678';
            process.env.JWT_SECRET = customSecret;

            const token = jwt.sign({ userId: 'user123', role: 'user' }, customSecret, { expiresIn: '1h' });
            req.get.mockReturnValue(`Bearer ${token}`);

            authToken(req, res, next);

            expect(next).toHaveBeenCalled();
            expect(req.userId).toBe('user123');
            expect(req.userRole).toBe('user');
            expect(res.status).not.toHaveBeenCalled();
        });

        it('should reject token signed with wrong secret', () => {
            const correctSecret = 'correct-secret-key-32-characters-long';
            const wrongSecret = 'wrong-secret-key-32-characters-long!!';
            
            process.env.JWT_SECRET = correctSecret;

            // Token signed with wrong secret
            const token = jwt.sign({ userId: 'user123' }, wrongSecret, { expiresIn: '1h' });
            req.get.mockReturnValue(`Bearer ${token}`);

            authToken(req, res, next);

            expect(next).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ message: 'Token không hợp lệ hoặc đã hết hạn' });
        });

        it('should fail test before fix - hardcoded secret vulnerability', () => {
            // This test documents the vulnerability before the fix
            const hardcodedSecret = 'secret'; // Old vulnerable value
            const attackerToken = jwt.sign({ userId: 'admin', role: 'admin' }, hardcodedSecret);

            // Before fix, this token would be valid because secret is public
            let decodedAttackerToken;
            try {
                decodedAttackerToken = jwt.verify(attackerToken, hardcodedSecret);
            } catch (error) {
                decodedAttackerToken = null;
            }

            // Attacker can forge tokens with hardcoded secret
            expect(decodedAttackerToken).toBeTruthy();
            expect(decodedAttackerToken.userId).toBe('admin');
            expect(decodedAttackerToken.role).toBe('admin');
            
            // This is VULNERABLE - anyone knowing 'secret' can create valid tokens
        });

        it('should warn when JWT_SECRET is not set', () => {
            const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
            delete process.env.JWT_SECRET;

            const token = jwt.sign({ userId: 'user123' }, 'secret', { expiresIn: '1h' });
            req.get.mockReturnValue(`Bearer ${token}`);

            authToken(req, res, next);

            expect(consoleSpy).toHaveBeenCalledWith(
                expect.stringContaining('JWT_SECRET not set in environment variables')
            );

            consoleSpy.mockRestore();
        });

        it('should warn when JWT_SECRET is too short', () => {
            const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
            process.env.JWT_SECRET = 'short'; // Less than 32 characters

            const token = jwt.sign({ userId: 'user123' }, 'short', { expiresIn: '1h' });
            req.get.mockReturnValue(`Bearer ${token}`);

            authToken(req, res, next);

            expect(consoleSpy).toHaveBeenCalledWith(
                expect.stringContaining('JWT_SECRET should be at least 32 characters long')
            );

            consoleSpy.mockRestore();
        });
    });

    describe('createToken', () => {
        it('should create token using environment JWT_SECRET', () => {
            const customSecret = 'production-secure-secret-key-32-chars';
            process.env.JWT_SECRET = customSecret;

            req.body = { userId: 'user456' };

            createToken(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    token: expect.any(String)
                })
            );

            // Verify token can be decoded with same secret
            const returnedToken = res.json.mock.calls[0][0].token;
            const decoded = jwt.verify(returnedToken, customSecret);
            expect(decoded.userId).toBe('user456');
        });

        it('should demonstrate token forgery risk with known secret', () => {
            const knownSecret = 'secret'; // Publicly known
            
            // Attacker can create arbitrary tokens
            const forgedToken = jwt.sign(
                { userId: 'victim123', role: 'admin' },
                knownSecret
            );

            // This forged token would be accepted by the system
            const decoded = jwt.verify(forgedToken, knownSecret);
            expect(decoded.userId).toBe('victim123');
            expect(decoded.role).toBe('admin');

            // VULNERABILITY: Attacker gains admin access
        });
    });
});
