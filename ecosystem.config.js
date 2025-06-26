module.exports = {
  apps: [
    {
      name: 'netzet-test-staging-api',
      script: 'node',
      args: '-r dotenv/config . dotenv_config_path=./.env.staging ./dist/main.js',
    },
    {
      name: 'netzet-test-api',
      script: 'node',
      args: '-r dotenv/config . dotenv_config_path=./.env.production ./dist/main.js',
    },
  ],
};