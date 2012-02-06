/**
 * ActionManager JavaScript Library v0.1
 *
 * Copyright 2012, Adrian Gaudebert
 * Licensed under the MIT license.
 *
 */

var fs = require('fs'),
    path = require('path'),
    util = require('util');

(function(exports) {

    /**
     * Class ActionManager
     *
     * Handle actions.
     *
     * @author Adrian Gaudebert - adrian@gaudebert.fr
     * @constructor
     */
    function ActionManager() {

        //---------------------------------------------------------------------
        // is this really needed?
        //---------------------------------------------------------------------
        /**
         * Function for getting an object from an ID. This function should be
         * overwritten in a subclass.
         */
        this.get = function(ID) {
            // This method is to be overwritten
            return null;
        };
        //---------------------------------------------------------------------

        /**
         * List of all the available actions (in their modules).
         *
         * Example use:
         *      actionManager.actions.unit.move(unitID, cellID);
         *  will call the function move() of the unit module, passing as
         *  parameters two identifiers of objects of the game.
         */
        var actionsList = this.actions = {};

        /**
         * Add a list of actions from a module to the current dictionary of
         * actions. Use the module name as a namespace for all actions.
         */
        var addActions = function(module, actions) {
            if (typeof actions == "undefined" || actions === null || actions.length == 0) {
                util.log("No action to add for module '" + module + "'");
                return false;
            }

            // Create the module
            var namespace = actionsList[module] = {};

            for (a in actions) {
                // Create an action object that has all properties and is callable
                var Action = function() {};
                Action.prototype = Function.prototype;

                var act = new Action();
                act.check = actions[a].check;
                act.execute = actions[a].execute;
                act.actionName = a;
                act.module = module;

                var action = function() {
                    if (act.check.apply(act, arguments)) {
                        act.execute.apply(act, arguments);
                        return true;
                    }
                    return false;
                };
                action.__proto__ = act;

                // Now action can be used in those ways:
                // action(); -> call check() and if true call execute()
                // action.check()
                // action.execute()

                namespace[a] = action;
            }
        };

        /**
         * Load all actions inside a directory of modules.
         */
        this.loadActions = function(pathToModules) {
            pathToModules = path.normalize(pathToModules);
            if (!path.existsSync(pathToModules)) {
                util.log("The modules directory '" + pathToModules + "' doesn't exist");
                return false;
            }

            modules = fs.readdirSync(pathToModules);
            for (m in modules) {
                var actionsFilePath = path.join(pathToModules, modules[m], 'actions.js');
                if (path.existsSync(actionsFilePath)) {
                    var actionsFile = require('./' + actionsFilePath); // Sad hack...
                    addActions(modules[m], actionsFile.actions);
                }
            }

            return true;
        };
    }

    exports.ActionManager = ActionManager;

})(typeof exports === 'undefined' ? this['exports'] = {} : exports);
