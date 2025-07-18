export const users = [
  {
    id: 1,
    username: 'admin',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin',
  },
  {
    id: 2,
    username: 'operador',
    email: 'operador@example.com',
    password: 'operador123',
    role: 'operador',
  },
  {
    id: 3,
    username: 'propietario',
    email: 'propietario@example.com',
    password: 'propietario123',
    role: 'propietario',
  },
];

// Función para validar usuario por email y contraseña
export function getUserByCredentials(email, password) {
  return users.find(
    user =>
      (user.email === email || user.username === email) &&
      user.password === password
  );
}