/**
 * Base Migration
 *
 * @author idmontie
 */

/* global console */

// TODO unit tests
// TODO settings should dictate what db to use.
this.Migrations = {
  warehouse : new Meteor.Collection( 'migrations' ),
  add : function ( name, migrationCallback ) {
    'use strict';

    if ( ! ( name in this.migrations ) ) {
      this.migrations[name] = migrationCallback

      return true
    } else {
      return false
    }
  },
  remove : function ( name ) {
    'use strict';

    delete this.migrations[name]
  },
  update : function ( name, newMigrationCallback ) {
    'use strict';

    this.migrations[name] = migrationCallback
  },
  verbose : false,
  // Initially empty
  migrations : {}
};


Meteor.startup( function () {
  'use strict';

  for ( var property in this.Migrations.migrations ) {
    if ( this.Migrations.migrations.hasOwnProperty( property ) ) {
      // Do the migration
      var pastMigration = this.Migrations.warehouse.findOne( {
        name : property
      } )

      if ( ! pastMigration ) {
        console.log ( '> Starting ' + property + ' migration.' )

        this.Migrations.migrations[property]()

        this.Migrations.Warehouse.insert( { name : property } )
        console.log ( '> Finishing ' + property + ' migration.' )
      } else {
        if ( this.verbose ) {
          console.log( '> Skipping ' + property + '.' )  
        }
      }
    }
  }
} )