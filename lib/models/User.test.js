require('dotenv').config();

const User = require('./User');

describe('User model', () => {
  it('sets a password hash', () => {
    const user = new User({
      name: 'langston Thats me',
      phone: '(555) 555-555',
      email: 'to personal',
      communicationMedium: 'phone',
      imageUrl: 'im an dimmiage',
      password: 'test1234'
    });

    expect(user.passwordHash).toEqual(expect.any(String));
  });

  it('has an authToken method', () => {
    const user = new User({
      name: 'langston Thats me',
      phone: '(555) 555-555',
      email: 'to personal',
      communicationMedium: 'phone',
      imageUrl: 'im an dimmiage',
      password: 'test31234'
    });

    expect(user.authToken()).toEqual(expect.any(String));
  });

  it('can verify a token and return a user', () => {
    const user = new User({
      name: 'langston Thats me',
      phone: '(555) 555-555',
      email: 'to personal',
      communicationMedium: 'phone',
      imageUrl: 'im an dimmiage',
      password: 'test31234'
    });

    const token = user.authToken();
    const verifiedUser = User.varify(token);

    expect(verifiedUser.toJSON()).toEqual(user.toJSON());
  });
});
