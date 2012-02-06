/**
 * ActionManager JavaScript Library v0.1
 *
 * Copyright 2012, Adrian Gaudebert
 * Licensed under the MIT license.
 *
 */

(function(exports) {

    var actions = {
        "move": {
            "check": function(unit, dest) {
                return unit.canMove() && unit.canGoTo(dest);
            },
            "execute": function(unit, dest) {
                unit.position = dest.position;
            }
        },
        "attack": {
            "check": function(attacker, defender) {
                return attacker.canReach(defender);
            },
            "execute": function(attacker, defender) {
                defender.life -= attacker.attack;
                if (defender.canReach(attacker)) {
                    attacker.life -= defender.defense;
                }
            }
        }
    };

    exports.actions = actions;

})(typeof exports === 'undefined' ? this['exports'] = {} : exports);

