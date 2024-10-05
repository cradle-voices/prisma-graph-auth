const jwt = require('jsonwebtoken');
const { generateOTP } = require('../src/utils/emailUtils'); // Assuming OTP logic is in this file

describe('Token Utils', () => {
  const secret = process.env.PRISMA_SECRET;
  
  it('should generate and verify a valid JWT token', () => {
    const payload = { id: 1, email: 'test@example.com' };
    const token = jwt.sign(payload, secret, { expiresIn: '1h' });

    const decoded = jwt.verify(token, secret);
    expect(decoded.id).toBe(payload.id);
    expect(decoded.email).toBe(payload.email);
  });

  it('should fail to verify a malformed token', () => {
    const badToken = 'BAD_TOKEN SLSLSLSLSLSL';

    expect(() => jwt.verify(badToken, secret)).toThrow('jwt malformed');
  });

  it('should generate a 6-digit OTP', () => {
    const otp = generateOTP();
    expect(otp).toHaveLength(6);
    expect(Number(otp)).toBeGreaterThan(100000); // Check that it's a 6-digit number
  });
});
