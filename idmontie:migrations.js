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
     * TODO settings should dictate what b to use.
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
     * @param String name Name of the migration
     * @param Function migrationCallback The function to run once and only once
     * @return boolean
     */
    add : function ( name, migrationCallback ) {
      'use strict';

      if ( ! ( name in _$.Migrations.migrations ) ) {
        _$.Migrations.migrations[name] = migrationCallback

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

      delete _$.Migrations.migrations[name]
    },
    /**
     * Removes the migration from the database, so that it can be run again.
     *
     * @param String name Name of the migration
     */
    removeFromDatabase : function ( name ) {
      'use strict';

      // TODO settings should dictate what db to use
      _$.warehouse.remove( {
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
    update : function ( name, newMigrationCallback ) {
      'use strict';

      _$.Migrations.migrations[name] = newMigrationCallback
    },
    /**
     * Enables console logs for already run migrations.
     *
     * @type boolean
     */
    verbose : false,
    /**
     * Object of migrations.  Do not use directly.
     *
     * Initially empty, no migrations to run
     *
     * @type Object
     */
    migrations : {}
  };

  // ==============
  // Meteor Startup
  // ==============

  Meteor.startup( function () {
    'use strict';

    for ( var property in _$.Migrations.migrations ) {
      if ( _$.Migrations.migrations.hasOwnProperty( property ) ) {
        // Do the migration
        var pastMigration = _$.Migrations.warehouse.findOne( {
          name : property
        } )

        if ( ! pastMigration ) {
          console.log ( '> Starting ' + property + ' migration.' )

          _$.Migrations.migrations[property]()

          _$.Migrations.warehouse.insert( {
            name : property
          } )

          console.log ( '> Finishing ' + property + ' migration.' )
        } else {
          if ( _$.verbose ) {
            console.log( '> Skipping ' + property + '.' )
          }
        }
      }
    }
  } )
}
