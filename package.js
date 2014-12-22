Package.describe({
  name: 'idmontie:migrations',
  summary: ' /* Fill me in! */ ',
  version: '1.0.0',
  git: ' /* Fill me in! */ '
});

Package.onUse(function(api) {
  api.versionsFrom('1.0.2');
  api.addFiles('idmontie:migrations.js');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('idmontie:migrations');
  api.addFiles('idmontie:migrations-tests.js');
});
