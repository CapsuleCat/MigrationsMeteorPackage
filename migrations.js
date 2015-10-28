/**
 * Meteor Migration
 *
 * Simple database migrations for meteor
 *
 * @author idmontie
 */

/* global console */

if ( Meteor.isServer ) {
  var _$ = this;

  // =================
  // Meteor Migrations
  // =================

  this.Migrations = {
    /**
     * Meteor collection to store data in
     * TODO settings should dictate what db to use.
     */
    warehouse : new Meteor.Collection( 'meteor-migrations' ),
    /**
     * Add a migration.  Will run the given migration once and only
     * once, even when the app is restarted.
     *
     * Returns true if a migration of the same name is not already added.
     * Returns false if otherwise.
     *
     * Migration names should be globally unique.
     *
     * The order number is an optional parameter that sets what
     * order the migrations should be run in. Migrations are run
     * from smallest order number to largest order number.  If an
     * order number is not provided, the largest order number + 10
     * is used.
     *
     * @param String name Name of the migration
     * @param Function migrationCallback The function to run once and only once
     * @param Number order Optional order number
     * @return boolean
     */
    add : function ( name, migrationCallback, rollbackCallback, order ) {
      'use strict';

      // If we are called with less than 4 arguments, than assume
      // that we are being called with the following signature:
      // ( name, migrationCallback, order ) 
      if ( arguments.length < 4 ) {
        order = rollbackCallback;
        rollbackCallback = null;
      }

      var found = false

      for ( var i = 0; i < _$.Migrations.migrations.length; i++ ) {
        if ( name == _$.Migrations.migrations[i].name ) {
          found = true
          break
        }
      }

      if ( ! found ) {
        if ( order == null ) {
          order = _$.Migrations.largestOrderNumber + 10
          _$.Migrations.largestOrderNumber = order
        } else if ( order > _$.Migrations.largestOrderNumber ) {
          _$.Migrations.largestOrderNumber = order
        }

        _$.Migrations.migrations.push( {
          migrationCallback: migrationCallback,
          rollbackCallback: rollbackCallback,
          name: name,
          order: order
        } )

        return true
      } else {
        return false
      }
    },
    /**
     * Removes the migration from the current queue.
     * This does NOT remove the migration from the collection of
     * previously run migrations.
     *
     * To remove a migration to allow it to rerun, use removeFromDatabase.
     *
     * @param String name Name of the migration
     */
    remove : function ( name ) {
      'use strict';

      for ( var i = 0; i < _$.Migrations.migrations.length; i++ ) {
        if ( _$.Migrations.migrations[i].name == name ) {
          delete _$.Migrations.migrations[i];
        }
      }
    },
    /**
     * Removes the migration from the database, so that it can be run again.
     *
     * @param String name Name of the migration
     */
    removeFromDatabase : function ( name ) {
      'use strict';

      // TODO settings should dictate what db to use
      _$.Migrations.warehouse.remove( {
        name : name
      } )
    },
    /**
     * Changes which function to run when the migration is performed.
     *
     * If the migration with the given name has already been run, this will
     * NOT force a re-run of the migration.  This is only available to override
     * which migration to run.
     *
     * @param String name Name of the migration
     * @param Function newMigrationCallback The new function to run once and only once
     */
    update : function ( name, newMigrationCallback, order ) {
      'use strict';

      for ( var i = 0; i < _$.Migrations.migrations.length; i++ ) {
        if ( name == _$.Migrations.migrations[i].name ) {
          if ( order == null ) {
            order = _$.Migrations.migrations[i].order
          } else if ( order > _$.Migrations.largestOrderNumber ) {
            _$.Migrations.largestOrderNumber = order
          }
        }

        _$.Migrations.migrations[i] = {
          migrationCallback: newMigrationCallback,
          name: name,
          order: order
        }
      }
    },
    /**
     * Rollback a given migration. The migration will be rerun on start up since
     * this also removes the migration from the database.
     *
     * @param String name The name of the migration to rollback
     */
    rollback : function ( name ) {
      for ( var i = 0; i < _$.Migrations.migrations.length; i++ ) {
        if ( _$.Migrations.migrations[i].name == name ) {
          
          if ( _$.Migrations.migrations[i].rollbackCallback ) {
            _$.Migrations.migrations[i].rollbackCallback();
          }
        }
      }

      _$.Migrations.removeFromDatabase( name );
    },
    /**
     * Enables console logs for already run migrations.
     *
     * @type boolean
     */
    verbose : false,
    /**
     * Array of migration objects.  Do not use directly.
     *
     * Initially empty, no migrations to run
     *
     * Object structure:
     *
     * - orderNumber
     * - name
     * - migrationCallback
     *
     * @type Array
     */
    migrations : [],
    /**
     * Stores the largest order number
     *
     * @type Number
     */
    largestOrderNumber : 0
  };

  // ==============
  // Meteor Startup
  // ==============

  Meteor.startup( function () {
    'use strict';

    /*
     * Migrations are unsorted.  Sort them and do them in order of
     * smallest to largest order number
     */

    _$.Migrations.migrations.sort( function ( a, b ) {
      if ( a.order < b.order ) {
        return -1;
      } else if ( a.order > b.order ) {
        return 1;
      } else {
        return 0;
      }
    } )


    for ( var i = 0; i < _$.Migrations.migrations.length; i++ ) {
      var migration = _$.Migrations.migrations[i]
      // Do the migration
      var pastMigration = _$.Migrations.warehouse.findOne( {
        name : migration.name
      } )

      if ( ! pastMigration ) {
        console.log ( '> Starting ' + migration.name + ' migration.' )

        migration.migrationCallback()

        _$.Migrations.warehouse.insert( {
          name : migration.name
        } )

        console.log ( '> Finishing ' + migration.name + ' migration.' )
      } else {
        if ( _$.verbose ) {
          console.log( '> Skipping ' + migration.name + '.' )
        }
      }
    }
  } )
}
