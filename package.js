Package.describe( {
  name: 'idmontie:migrations',
  summary: 'Simple database migrations for meteor',
  version: '1.0.0',
  git: 'https://github.com/idmontie/migrations.git'
} );

Package.onUse( function ( api ) {
  'use strict';

  api.versionsFrom( '1.0.2' )
  api.addFiles( 'idmontie:migrations.js' )
});

Package.onTest( function ( api ) {
  'use strict';

  api.use( 'tinytest' )
  api.use( 'idmontie:migrations' )
  api.addFiles('idmontie:migrations-tests.js' )
} );
