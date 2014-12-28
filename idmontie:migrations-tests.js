// ==========================
// Test by running migrations
// ==========================

/* global Migrations */

// =================
// Clean up old data
// =================
var _$ = this;

_$.data = new Meteor.Collection( 'test-migrations-data-' + Date.now() );

// ================================================================
// Migrations
//
// Migrations are added in reverse of their priority numbers.
// This is to test that they are actually run in the correct order.
// ================================================================
Migrations.removeFromDatabase('transform-data');
Migrations.add( 'transform-data', function () {
  'use strict';

  _$.data.update( {}, {
    $rename : {
      value : 'renamed'
    }
  })

}, 1 );

Migrations.removeFromDatabase('data');
Migrations.add( 'data', function () {
  'use strict';

  _$.data.insert( {
    value: 'wow'
  } )
}, 0 );

// =====
// Tests
// =====
Tinytest.add('data should not have values post migration', function (test) {
  'use strict';

  var nExistsData = _$.data.findOne( {
    value : 'wow'
  } )

  test.isUndefined( nExistsData )

  var existsData = _$.data.findOne( {
    renamed : 'wow'
  } )

  test.isNotNull( existsData )
});
