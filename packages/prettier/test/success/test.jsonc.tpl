{
  // Project configuration settings
  "version": "1.0.0",

  /* Application settings */
  "app": {
    "name": "MyApp",
    "port": 8080, // Port number for the server
    "features": {
      "authentication": true,
      "logging": false // Enable or disable logging
    }
  },

  "database": {
    "host": "localhost",
    "port": 5432,
    "username": "admin",
    "password": "securepassword", // Ensure this is kept secret
    // Connection pool settings
    "pool": {
      "max": 10,
      "min": 2,
      "idleTimeoutMillis": 30000
    }
  },

  // List of enabled plugins
  "plugins": [
    "plugin-one",
    "plugin-two" // Add or remove plugins as needed
  ],

  /* Environment-specific overrides */
  "env": {
    "development": {
      "debug": true,
      "loggingLevel": "verbose"
    },
    "production": {
      "debug": false,
      "loggingLevel": "error"
    }
  }
}
