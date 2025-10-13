/**
 * Represents a user.
 */
interface User {
  id: number;
  name: string;
  email: string;
}

/**
 * Fetches a user by ID.
 * @param id - The ID of the user.
 * @returns A promise that resolves to a User.
 */
export async function getUser(id: number): Promise<User> {
  // Simulate fetching user data
  return {
    id,
    name: 'John Doe',
    email: 'john.doe@example.com',
  };
}
