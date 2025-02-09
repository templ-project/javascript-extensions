{
  // Application configuration
  version: '2.1.3',

  app: {
    name: 'AwesomeApp',
    port: 3000,
    features: {
      authentication: true,
      logging: false, // Toggle logging feature
    },
    // Supported languages
    supportedLanguages: [
      'en',
      'es',
      'fr',
      // Add more languages as needed
    ],
  },

  database: {
    host: 'db.local',
    port: 27017,
    username: 'dbUser',
    password: 'strongpassword', // Keep this secure
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },

  plugins: [
    'plugin-alpha',
    'plugin-beta', // Ensure plugins are compatible
  ],

  /* Environment configurations */
  env: {
    development: {
      debug: true,
      loggingLevel: 'verbose',
    },
    production: {
      debug: false,
      loggingLevel: 'error',
    },
  },
}
