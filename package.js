Package.describe( {
  name: 'idmontie:migrations',
  summary: 'Simple database migrations for meteor',
  version: '1.0.1',
  git: 'https://github.com/CapsuleCat/MigrationsMeteorPackage.git'
} );

Package.onUse( function ( api ) {
  'use strict';

  api.versionsFrom( '1.0.2' );
  api.addFiles( 'migrations.js', 'server' );

  // Export
  api.export('Migrations', 'server');
});

Package.onTest( function ( api ) {
  'use strict';

  api.use( 'tinytest' )
  api.addFiles( 'migrations.js' )
  api.addFiles('migrations-tests.js' )
} );
