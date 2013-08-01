/**
 * Test cases for ActionManager class.
 *
 * Requires node.js and its nodeunit module.
 * To run those tests: nodeunit tests/test_action-manager.js
 *
 * @author Adrian Gaudebert - adrian@gaudebert.fr
 */

var am = require('../action-manager');

var newunit1 = function () {
    return {
        position: 1,
        life: 100,
        attack: 10,
        defense: 5,
        canMove: function () {
            return true;
        },
        canReach: function (unit) {
            return true;
        },
        canGoTo: function (dest) {
            return true;
        }
    };
};
var newunit2 = function () {
    return {
        position: 3,
        life: 90,
        attack: 20,
        defense: 15,
        canMove: function (unit) {
            return false;
        },
        canReach: function (unit) {
            return false;
        },
        canGoTo: function (dest) {
            return false;
        }
    };
};
var newcell = function () {
    return {
        position: 2
    };
};


exports['load-actions'] = function (test) {
    // One component case
    var myGE = new am.ActionManager();
    var unitActions = require('./modules/unit/actions.js');

    myGE.addActions('unit', unitActions.actions);

    test.ok(myGE.actions);
    test.ok(myGE.actions.unit);
    test.ok(myGE.actions.unit.move);
    test.ok(myGE.actions.unit.attack);
    test.equal(myGE.actions.unit.defend, null);
    test.equal(myGE.actions.unit.move.actionName, 'move');
    test.equal(myGE.actions.unit.attack.actionName, 'attack');

    test.done();
};

exports['use-actions'] = function (test) {
    // One component case
    var myGE = new am.ActionManager();
    var unitActions = require('./modules/unit/actions.js');

    var unit1 = newunit1();
    var unit2 = newunit2();
    var cell = newcell();

    myGE.addActions('unit', unitActions.actions);

    //.........................................................................
    // Testing the move action
    // Test that unit can move
    test.ok(myGE.actions.unit.move.check(unit1, cell));

    // Actually move that unit
    myGE.actions.unit.move.execute(unit1, cell);

    // Test that unit was moved
    test.equal(unit1.position, cell.position);

    //.........................................................................
    // Testing the attack action
    // Test that unit can reach the other one and then execute the attack
    test.ok(myGE.actions.unit.attack(unit1, unit2));

    // Test unit1 attacked unit2, but unit2 couldn't attack back
    test.equal(unit1.life, 100);
    test.equal(unit2.life, 80);

    test.done();
};

exports['several-actions'] = function (test) {
    // One component case
    var myGE = new am.ActionManager();
    var unitActions = require('./modules/unit/actions.js');

    var unit1 = newunit1();
    var unit2 = newunit2();
    var cell = newcell();

    myGE.addActions('unit', unitActions.actions);

    myGE.actions.unit.attack(unit1, unit2);

    test.equal(unit1.life, 100);
    test.equal(unit2.life, 80);

    myGE.actions.unit.move(unit1, cell);

    test.equal(unit1.position, cell.position);

    test.done();
};

exports['override-execute'] = function (test) {
    var myGE = new am.ActionManager();
    var unitActions = require('./modules/unit/actions.js');

    var unit1 = newunit1();
    var unit2 = newunit2();
    var cell = newcell();

    var count = 0;
    function myExecute() {
        count += 1;
    }

    myGE.addActions('unit', unitActions.actions, myExecute);

    myGE.actions.unit.move(unit1, cell);

    // test the action was not executed
    test.equal(unit1.position, 1);
    // test the callback was called instead
    test.equal(count, 1);

    myGE.actions.unit.attack(unit1, unit2);

    test.equal(unit1.life, 100);
    test.equal(unit2.life, 90);
    test.equal(count, 2);

    test.done();
};
