Meteor Migrations
=================
[![Travis](https://img.shields.io/travis/CapsuleCat/MigrationsMeteorPackage.svg?style=flat)](https://travis-ci.org/CapsuleCat/MigrationsMeteorPackage) 
[![GitHub license](https://img.shields.io/:license-mit-blue.svg?style=flat)](https://github.com/CapsuleCat/MigrationsMeteorPackage/blob/master/LICENSE.md)

Simple migrations framework for Meteor and Mongo.

Add functions that should only be run once -- ever.

# Dependencies

* Built for MongoDB

# Usage

Typically, data migrations should only happen once. The package takes care of the scaffolding for only running functions once ever.  An example for usage would be migrating all Books in a Mongo database to have "titles" instead of "names."  If you have test data with your app, or multiple developers working on the project, you'll find that you need migrations for occasionally.

# Documentation

This project adds `Migrations` to the `this` context. The following methods are provided:

## add

`Migrations.add( name, migrationCallback, optionalRollbackCallback, optionalOrder )`

```
Add a migration.  Will run the given migration once and only
once, even when the app is restarted.

Returns true if a migration of the same name is not already added.
Returns false if otherwise.

Migration names should be globally unique.
The order number is an optional parameter that sets what
order the migrations should be run in. Migrations are run
from smallest order number to largest order number.  If an
order number is not provided, the largest order number + 10
is used.

name (String) Name of the migration
migrationCallback (Function) The function to run once and only once
order (Number) Optional order number
```

## rollback

`Migrations.rollback( name )`

```
Runs the rollback callback for the given migration.

This does not remove the migration from the queue,
but it does remove the database entry for the given
migration.
```

## remove

`Migrations.remove( name ) `

```
Removes the migration from the current queue.
This does NOT remove the migration from the collection of 
previously run migrations.

To remove a migration to allow it to rerun, use removeFromDatabase.

name (String) Name of the migration
```

## removeFromDatabase

`Migrations.removeFromDatabase( name ) `

```
Removes the migration from the database, so that it can be run again.

name (String) Name of the migration
```

## update

`Migrations.update( name, newMigrationCallback, order )`

```
Changes which function to run when the migration is performed.

If the migration with the given name has already been run, this will
NOT force a re-run of the migration.  This is only available to override
which migration to run.

name (String) Name of the migration
newMigrationCallback (Function) The new function to run once and only once
order (Number)
```

# Examples

Here is an example where every developer's (and server's) database should be prepopulated with Google Maps Place Types:

**place-types-migration.js**
```javascript
Migrations.add( 'add-place-types-to-database', function () {
  'use strict';

  var googlePlaceTypes = [
    {
      slug : 'accounting',
      readibleName : 'Accounting'
    },
    // ...
  ];

  for ( var i = 0; i < googlePlaceTypes.length; i++ ) {
    PlaceTypes.insert( googlePlaceTypes[i] )  
  }
} );
```

# For Developers

To run the TinyTests, just run the following meteor command:

```cmd
meteor test-packages ./
```
