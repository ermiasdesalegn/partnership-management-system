import bcrypt from 'bcryptjs';

export const generateRandomPassword = () => {
  const length = 12;
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  let password = '';
  
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  
  return password;
};

export const hashPassword = async (password) => {
  return await bcrypt.hash(password, 12);
};

export const comparePasswords = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
}; 