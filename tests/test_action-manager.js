/**
 * Test cases for ActionManager class.
 *
 * Requires node.js and it's nodeunit module.
 * To run those tests: nodeunit tests/test_action-manager.js
 *
 * @author Adrian Gaudebert - adrian@gaudebert.fr
 */

var am = require('../action-manager');

exports['load-actions'] = function(test) {
    // One component case
    var myGE = new am.ActionManager(),
        res = myGE.loadActions('tests/modules');

    test.ok(res);

    test.ok(myGE.actions);
    test.ok(myGE.actions.unit);
    test.ok(myGE.actions.unit.move);
    test.ok(myGE.actions.unit.attack);
    test.equal(myGE.actions.unit.defend, null);
    test.equal(myGE.actions.unit.move.actionName, 'move');
    test.equal(myGE.actions.unit.attack.actionName, 'attack');

    test.done();
}

exports['use-actions'] = function(test) {
    // One component case
    var myGE = new am.ActionManager(),
        res = myGE.loadActions('tests/modules'),

        unit1 = {
            "position": 1,
            "life": 100,
            "attack": 10,
            "defense": 5,
            "canMove": function() {
                return true;
            },
            "canReach": function(unit) {
                return true;
            },
            "canGoTo": function(dest) {
                return true;
            }
        },
        unit2 = {
            "position": 3,
            "life": 90,
            "attack": 20,
            "defense": 15,
            "canMove": function(unit) {
                return false;
            },
            "canReach": function(unit) {
                return false;
            },
            "canGoTo": function(dest) {
                return false;
            }
        },
        cell = {
            "position": 2
        };

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
}
