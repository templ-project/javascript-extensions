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
async function getUser(id: number): Promise<User> {
  // Simulate fetching user data
  return {
    id,
    name: 'John Doe',
    email: 'john.doe@example.com',
  };
}

getUser(1).then((user) => {
  console.log(`User: ${user.name}, Email: ${user.email}`);
});
