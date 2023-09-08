//=============================================================================
// Follower Control
// by Tyruswoo
//
// Be sure to save as:
// Tyruswoo_FollowerControl.js
//=============================================================================

/*
 * MIT License
 *
 * Copyright (c) 2023 Kathy Bunn and Scott Tyrus Washburn
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
 
var Imported = Imported || {};
Imported.TYR_FollowerControl = true;

var Tyruswoo = Tyruswoo || {};
Tyruswoo.FollowerControl = Tyruswoo.FollowerControl || {};

/*:
 * @plugindesc v1.11.1  Allows greater control of party follower movement, balloon icons, animations, and transfers.
 * @author Tyruswoo
 *
 * @help
 * Follower Control
 * by Tyruswoo
 * Last Update:  August 2, 2019
 * 
 * WARNING: This is an older plugin! It lacks features and improvements
 * present in the latest version. You can get the latest version for free
 * on Tyruswoo.com.
 * ===========================================================================
 * Tyruswoo's Follower Control plugin allows greater control of party
 * follower movement.  It allows using these commands on any follower:
 *    - Set Move Route
 *    - Show Balloon Icon
 *    - Show Animation
 *    - Transfer Player
 * Now you can easily make cool cutscenes involving the party's followers
 * and leader!
 * ===========================================================================
 * Plugin commands in brief:
 *    Follower 0          // Target the leader (for Set Move Route of player).
 *    Follower 1          // Target follower 1 (for Set Move Route of player).
 *    Follower 2          // Etc.  Works for up to 50 followers.
 *    Follower StopChase  // Followers stop chasing the leader.
 *    Follower Chase      // Followers chase the leader again.
 *    Follower <Name>     // Target follower associated with actor named <Name>.
 *    Follower Variable <varId> //Target follower based on value of a variable.
 *    Follower Actor <actorId>  //Target follower associated with actor <actorId>
 *
 * For best results, use the above Plugin Commands in combination with the
 * Set Move Route command.  Make cool cutscenes!  :)
 * ===========================================================================
 * Example of how to use this plugin:
 *
 * Here is an example of using the Plugin Commands,
 * combined with the Set Move Route command.
 * Use the following commands within an event:
 *
 * Plugin Command: Follower StopChase  // * This changes follower behavior.
 *                                     //   They no longer follow the leader.
 * Plugin Command: Follower 1      // * This makes the Set Move Route command
 *                                 //   target Follower 1 instead of the leader.
 * (Now Set Move Route of player.) // * Instead of the party leader, follower 1
 *                                 //   will move independently.
 * Plugin Command: Follower 0      // * This resets how Set Move Route works.
 *                                 //   Now it will target the leader again.
 * (Now Set Move Route of player.) // * The party leader will move, but the
 *                                 //   followers will not chase the leader,
 *                                 //   since we used "Follower StopChase".
 * Plugin Command: Follower Chase  // * Resets follower behavior, so they
 *                                 //   chase the leader again.
 * ===========================================================================
 * Details of Plugin Commands to target a follower instead of the leader
 * for Set Move Route, Show Balloon Icon, Show Animation, or Transfer Player
 * commands.
 *
 * Example:
 *      Follower 1
 * The plugin command "Follower 1" will make all future Set Move Route commands
 * affect the first follower, i.e. the character following the party leader.
 * This effect will continue until resetting by using the following
 * plugin command:
 *      Follower 0
 * The plugin command "Follower 0" causes default behavior of all Move Route
 * event commands affecting the party leader.
 *
 * Important: Make sure you use plugin command "Follower 0" to reset, so
 * that future Set Move Route commands will affect the party leader!
 *
 * Number Codes:
 *
 * 0 = Leader
 * 1 = First Follower
 * 2 = Second Follower
 * 3 = Third Follower
 * 4 = Fourth Follower
 * 5 = Fifth Follower
 * And so on for up to 50 followers.
 *
 * If the selected follower is not present (i.e. the party is too small, and
 * that follower spot is not filled), then commands sent to that follower number
 * will have no effect.
 *
 * Notes on Transfer Player:
 * - No matter the follower/leader targeted, using a Transfer Player to go to
 *   a new map will always rejoin the party, making the followers chase the
 *   leader again, and setting the leader as the target (same as using
 *   Plugin Command "Follower 0").
 * - If transferring to the current map, then the targetted follower determines
 *   the effect of Transfer Player:
 *      > If the leader is targeted (Follower 0), then we check whether
 *        followers are chasing.
 *           >> If they are chasing, then we perform a Transfer Player type
 *              function, bringing the party together and performing the
 *              chosen fade.
 *           >> If the followers are not chasing, then the leader is
 *              teleported without affecting the followers' positions.
 *      > If a follower is targeted, then the follower is teleported
 *        without affecting the other followers' or leader's position.
 *
 * Tip:  If you want to transfer the followers and leader all independently
 *       during a cutscene, then be sure to use Plugin Command "Follower
 *       StopChase".  That way, transfers of the leader within the same map
 *       will no longer affect the followers, allowing for better cutscenes.
 *       (Note that this also works with TYR_CameraControl, allowing for
 *       the camera to stay focused on the correct camera target.)
 * ===========================================================================
 * Details of Plugin Commands to make followers stop and start following:
 *
 * Follower Chase
 *      Makes all followers chase the leader and each other.  This is the
 *      default behavior of followers.
 *
 * Follower StopChase
 *      Makes all followers stop chasing the leader and each other.  This
 *      is useful for cutscenes in which the party leader moves around
 *      alone, allowing followers and leader to all move independently.
 * ===========================================================================
 * Details of alternative ways to select a follower:
 *
 * Follower Variable variableID
 *      Where variableId is the ID number of the desired variable.
 *      This will use Variable variableId to determine which follower to
 *      select. If Variable variableId has not been set, then it will be 0,
 *      which will select the leader. If Variable variableId has been set to 3,
 *      then follower 3 will be selected. Etc. In this way, the Control Variables
 *      event command can be used to set a variable Id, which in turn selects
 *      a follower.
 *      Examples:
 *           Follower Variable 3
 *                This uses variable 3 to determine the follower. Set variable 3
 *                to the desired follower, then use this command to set the
 *                selected follower to the value of Variable 3.
 *           Follower Variable 27
 *                Same as above, but variable 27 is used. If variable 27 has
 *                not been set, it will be 0, and the leader will be selected.
 *                If variable 27 has been set to 1, then the first follower
 *                will be selected. Etc.
 *      This can also be used in combination with event Loops to cycle through
 *      all followers in turn.
 *
 * Follower Name
 *     where Name is the name of the follower's associated actor.
 *     Examples:
 *          Follower Harold
 *                This will select whichever follower is associated with
 *                the actor named Harold.
 *          Follower Marsha
 *                This will select whichever follower is associated with
 *                the actor named Marsha.
 *     This can be useful for certain cutscenes. For example, if you want a
 *     certain follower to have a question mark bubble, or to do a jump
 *     before speaking, etc, you can select that follower even if you do not
 *     know their position in the group. This can be helpful if you allow
 *     the player to alter the marching order of their characters' party.
 *
 * Follower Actor ID
 *     where ID is the ID number of the follower's associated actor.
 *     Examples:
 *          Follower Actor 2
 *                This will select whichever follower is associated with
 *                the actor of actorID number 2.
 *          Follower Actor 39
 *                This will select whichever follower is associated with
 *                the actor of actorID number 39.
 *     This can be useful just like selecting a follower by name, as described
 *     above. However, by using an actor ID, we can select the desired actor,
 *     even if the name of the actor has been modified. This is useful for
 *     games that allow the player to change the names of all their actors.
 * ===========================================================================
 * Synonyms:  Here are a few alternate ways to write the same plugin command:
 *
 * For the term "Follower", you may type any of these:
 *      Follower       follower       FOLLOWER
 *      Follow         follow         Follow
 *
 * For the term "Chase", you may type any of these:
 *      Chase          chase          CHASE
 *      Chase True     chase true     CHASE TRUE
 *      Chase Start    chase start    CHASE START
 *
 * For the term "StopChase", you may type any of these:
 *      StopChase      stopchase      STOPCHASE
 *      stopChase      Stopchase
 *      Chase False    chase false    CHASE FALSE
 *      Chase Stop     chase stop     CHASE STOP
 * ===========================================================================
 * v1.00  January 17, 2016:
 *        Created the plugin and added the following features:
 *        - Plugin command "Follower" to select followers.
 *        - Set Move Route effect on followers.
 *        - Plugin commands "StopChase" and "Chase" to control followers
 *          chasing the leader.
 *
 * v1.01  January 19, 2016:
 *        Added the following features:
 *        - Show Balloon Icon for followers.
 *        - Show Animation for followers.
 *        - Transfer Player for followers.
 *
 * v1.02  January 19, 2016:
 *        Worked on fixing a bug.  However, errors still occured.  See below.
 *
 * v1.03  January 20, 2016:
 *        Fixed the bug found on January 19th.
 *        - Previously, the "Follower" plugin command had to be used prior to
 *          ever using Set Move Route or other featured commands in your game;
 *          If the "Follower" plugin command was not used first, the game would
 *          freeze.  Now, the plugin no longer requires this!  If you never
 *          use a "Follower" plugin command, your game will function as it
 *          would by default, without errors.
 *
 * v1.04  January 20, 2016:
 *        Added feature:
 *        - If a follower is on the same tile as the leader, and then
 *          Set Move Route is used to "Turn toward Player", then the
 *          follower will now turn to face the same direction as the leader!
 *          So, by using the Gather Followers event command, then using
 *          Set Move Route "Turn toward Player", it is possible to make
 *          followers be in a predictable position (right where the leader is),
 *          from whence the followers can then be sent out in a pre-prepared
 *          formation.  This allows for ease of creating Common Events for
 *          for your various formations of follower movement!
 *
 * v1.05  Sept. 4, 2018:
 *        Added feature:
 *        - Now, when StopChase is on, and the leader's MoveRoute is
 *          caused to jump, the followers will not jump.
 *
 * v1.06  Dec. 22, 2018:
 *        Added features:
 *        - Now can select follower based on a variable's value, using
 *          the Follower Variable <VariableId> plugin command.
 *        - Now can select follower based on their actor's name, using
 *          the Follower <Name> plugin command.
 *
 * v1.07  Dec. 31, 2018:
 *        Added feature:
 *        - Now can select follower based on an actor's ID, using
 *          the Follower Actor <actorId> plugin command.
 *
 * v1.08  Feb. 27, 2019:
 *        Added feature/fixed bug:
 *        - Followers can be set to have unique qualities of the following,
 *          using Set Move Route:
 *            - Opacity
 *            - Blend Mode
 *            - Walk Animation On/Off
 *            - Step Animation On/Off
 *            - Direction Fix On/Off
 *            - Transparency On/Off
 *          For these qualities, followers will retain their individual
 *          qualities. However, if StopChase is Off, and one of these
 *          qualities is applied to the player, then the same quality
 *          will be applied to all followers, as well. Therefore, if you
 *          want to apply any of the above qualities to only the leader,
 *          StopChase must be On.
 *        - Also, followers will now retain their own Move Speed as long as
 *          StopChase is On, even if the followers are moving and the player
 *          is moving at the same time. (However, unlike the above qualities,
 *          if StopChase is turned back Off, followers will immediately
 *          be reset to the player's Move Speed.)
 *
 * v1.09  March 8, 2019:
 *        Added feature:
 *        - A new script call was added, which can be used within the
 *          Set Move Route command to make any follower pathfind to any
 *          coordinates on the map, to any of the current map's events,
 *          or to any follower. 
 *        - First, select the desired Follower. Then, within the
 *          Set Move Route command, use one of these scripts:
 *
 *            this.path(17, 5)
 *              This finds the path to x coordinate 17, y coordinate 5.
 *
 *            this.path("event", 3)
 *              This finds the path to Event 3 on the current map.
 *
 *            this.path("follower", 2)
 *              This finds the path to Follower 2.
 *
 *          For whichever of the above pathing arguments you use,
 *          the player or follower will only move one step each time
 *          you call the script. You can use the script as many times
 *          as you need, in order to make the player or follower step
 *          toward the target for that many steps.
 *        - Note: This script call also works for events. Just use the script
 *          call within Set Move Route.
 *        - Note: This script call has no variability, so it always
 *          finds the straightest path, and will always yield the same result
 *          every time. (This is different from the "Approach" movement type,
 *          which has randomness, producing variability.)
 *
 * v1.10  June 23, 2019:
 *        Added feature:
 *        - A new plugin command was added, which allows switching the
 *          image of the currently selected follower, based on the currently
 *          selected follower's default image.
 *        - To use poses, you first need to create the appropriately named
 *          pose image files. Then, you can call those files for your
 *          follower at any time. The follower's default image will be used
 *          to determine what their poses can be.
 *        - You can create an infinite number of your own poses! To create a
 *          pose, you need to have the default image file for the character,
 *          and then create another image file with an underscore added at
 *          the end, followed by the name of the pose (in lowercase letters).
 *          For example, if our character's default image is:
 *
 *                $McKathlinIsAwesome.png
 *
 *          Then our pose image for a wink should be named:
 *
 *                $McKathlinIsAwesome_wink.png
 *
 *          Or, our pose image for that character's wounded image should be:
 *
 *                $McKathlinIsAwesome_wounded.png
 *
 *          And likewise for any other pose images for that character. You can
 *          have as many poses as you want! There is no maximum.
 *
 *          Important Note: The poses must all have the same index value as the
 *          default pose. In other words, the pose images must be the same size
 *          as the default image, with the pose at the same position within the
 *          image file.
 *        - For example, if we want to make a certain follower wink, we first
 *          select the follower. Then, make that follower change to a wink
 *          pose:
 *
 *                Follower Pose wink
 *
 *          Have the follower hold the pose for a moment or say something, etc,
 *          then return the follower to a default pose. There are several ways
 *          to do this, and all are equivalent:
 *
 *                Follower Pose default
 *                Follower Pose normal
 *                Follower Pose none
 *                Follower Pose stand
 *                Follower Pose standing
 *                
 *          All of the above plugin commands do the same thing of returning
 *          the follower to their default pose.
 *
 * v1.11  August 2, 2019:
 *        Modified feature: There are now two ways to select a follower by
 *        their name. You can select a follower by their actor's name, as
 *        listed in the database.
 *        - By default, followers will be selected based on their actor's
 *          name in the database. For example:
 *
 *                Follower Shompta
 *
 *          The above searches the followers, and if a follower's actor has
 *          the name "Shompta" in the database, then that follower is selected.
 *        - You can, if so desired, still search for an actor based on their
 *          current name. The only reason to use this method is if
 *          you want special things to occur only when an actor has a special
 *          name that the player has entered in. For example, either of the
 *          following will select a follower who is currently named
 *          "SecretCode".
 *
 *                Follower CurrentName SecretCode
 *                Follower Current_Name SecretCode
 *
 *          If a player has indeed renamed an actor to be named "SecretCode",
 *          then the follower associated with that actor will be selected.
 * 
 * v1.11.1: September 7, 2023:
 *          This plugin is now free and open source under the MIT license.
 * ============================================================================
 * MIT License
 *
 * Copyright (c) 2023 Kathy Bunn and Scott Tyrus Washburn
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the “Software”), to
 * deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 * sell copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
 */

//=============================================================================
// Game_Interpreter
//=============================================================================

// Alias method.
Tyruswoo.FollowerControl.Game_interpreter_clear = Game_Interpreter.prototype.clear
Game_Interpreter.prototype.clear = function() {
	Tyruswoo.FollowerControl.Game_interpreter_clear.call(this);
    this._follower = $gamePlayer;
};

// Replacement method
// Transfer Player
Game_Interpreter.prototype.command201 = function() {
    if (!$gameParty.inBattle() && !$gameMessage.isBusy()) {
        var mapId, x, y;
        if (this._params[0] === 0) {  // Direct designation
            mapId = this._params[1];
            x = this._params[2];
            y = this._params[3];
        } else {  // Designation with variables
            mapId = $gameVariables.value(this._params[1]);
            x = $gameVariables.value(this._params[2]);
            y = $gameVariables.value(this._params[3]);
        }
		if (mapId !== $gameMap._mapId) {  //Transfer the leader, with followers.
			$gamePlayer._followers._stopChase = false;  //If player goes to a new map, followers will resume chase.
			this._follower = $gamePlayer;  //If player goes to a new map, reset target follower to the leader.
			$gamePlayer.reserveTransfer(mapId, x, y, this._params[4], this._params[5]);
			this.setWaitMode('transfer');
		} else if (this._follower === $gamePlayer) {
			if (!$gamePlayer._followers._stopChase) { //Followers are chasing the leader, so transfer leader with followers.
				$gamePlayer.reserveTransfer(mapId, x, y, this._params[4], this._params[5]);
				this.setWaitMode('transfer');
			} else { //Followers are not chasing the leader, so simply teleport the leader within the map, like any other follower.
				Game_Character.prototype.locate.call($gamePlayer, x, y);
				if (Imported.TYR_CameraControl) {
					if ($gameMap._camFollow === 'player') {
						$gamePlayer.center(x, y);
					}
				} else {
					$gamePlayer.center(x, y);
				}
				$gamePlayer.makeEncounterCount();
				if ($gamePlayer.isInVehicle()) {
					$gamePlayer.vehicle().refresh();
				}
			}
		} else {  //Transfer a follower.
			this._follower.locate(x, y);
			if (this._params[4] > 0) { // Set follower direction
				var d = this._params[4];
				if (!this._follower.isDirectionFixed() && d) {
					this._follower._direction = d;
				}
			}
		}
		this._index++;	
    }
    return false;
};

// Replacement method
// Set Movement Route
Game_Interpreter.prototype.command205 = function() {
    $gameMap.refreshIfNeeded();
    this._character = this.character(this._params[0]);
	if (this._character === $gamePlayer) {
		this._character = this._follower;
	}
    if (this._character) {
        this._character.forceMoveRoute(this._params[1]);
        if (this._params[1].wait) {
            this.setWaitMode('route');
        }
    }
    return true;
};

// Replacement method
// Show Balloon Icon
Game_Interpreter.prototype.command213 = function() {
    this._character = this.character(this._params[0]);
	if (this._character === $gamePlayer) {
		this._character = this._follower;
	}
    if (this._character) {
        this._character.requestBalloon(this._params[1]);
        if (this._params[2]) {
            this.setWaitMode('balloon');
        }
    }
    return true;
};

// Replacement method
// Show Animation
Game_Interpreter.prototype.command212 = function() {
    this._character = this.character(this._params[0]);
	if (this._character === $gamePlayer) {
		this._character = this._follower;
	}
    if (this._character) {
        this._character.requestAnimation(this._params[1]);
        if (this._params[2]) {
            this.setWaitMode('animation');
        }
    }
    return true;
};

// Alias method
Tyruswoo.FollowerControl.Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function(command, args) {
    Tyruswoo.FollowerControl.Game_Interpreter_pluginCommand.call(this, command, args);
	var c = command.toUpperCase();
    if (c === "FOLLOW" || c === "FOLLOWER") {
		switch (args[0].toUpperCase()) {
			case 'CHASE':
				var arg1 = null;
				if(args[1]) arg1 = args[1].toUpperCase();
				if (arg1 === 'FALSE' || arg1 === 'STOP') {
					$gamePlayer._followers._stopChase = true;
					console.log("Follower Chase false:  Followers no longer chase the leader.");
				} else {
					$gamePlayer._followers._stopChase = false;
					console.log("Follower Chase:  Followers now chase the leader.");
				}
				break;
			case 'STOPCHASE':
				$gamePlayer._followers._stopChase = true;
				console.log("Follower StopChase:  Followers no longer chase the leader.");
				break;
			case 'VARIABLE':
				var variableId = parseInt(args[1]);
				var follower_position = $gameVariables.value(variableId);
				if (follower_position > 0) {
					this._follower = $gamePlayer.followers().follower(follower_position - 1);
					console.log("Follower:  Move Route commands now affect Follower", follower_position);
				} else {
					this._follower = $gamePlayer;
					console.log("Follower:  Move Route commands now affect the party Leader.");
				}
				break;
			case 'ACTOR':
				var actorId = parseInt(args[1]);
				var len = $gameParty.battleMembers().length;
				var follower_found = false;
				for (var i = 0; i < len; i++) {
					if($gameParty.battleMembers()[i].actorId() == actorId) {
						if(i > 0) {
							this._follower = $gamePlayer.followers().follower(i - 1);
						} else {
							this._follower = $gamePlayer;
						}
						console.log("Follower:  Move Route commands now affect Actor " + actorId + ", who is Follower", i);
						follower_found = true;
					}
				}
				if(!follower_found) {
					console.warn("Follower: Error! Unable to find a follower with Actor ID", actorId);
				}
				break;
			case 'POSE':
				var actor = this._follower._memberIndex > 0 ? $gameParty.members()[this._follower._memberIndex] : $gameParty.members()[0];
				var actorId = actor ? actor.actorId() : 0;
				if(actorId) {
					if(!$gameActors.actor(actorId)._characterNameCore) {
						$gameActors.actor(actorId)._characterNameCore = $gameActors.actor(actorId).actor().characterName;
					}
					var core = $gameActors.actor(actorId)._characterNameCore;
					var pose = core;
					if(args[1]) {
						var arg1 = args[1].toLowerCase();
						switch(arg1) {
							case "stand":
							case "standing":
							case "default":
							case "normal":
							case "none":
								break;
							default:
								pose += "_" + arg1;
						}
					}
					$gameActors.actor(actorId)._characterName = pose;
					$gamePlayer.refresh();
					console.log("Follower Pose: Changed actor", actorId, "to pose", pose);
				} else {
					console.warn("Follower Pose: Error! No actor ID.");
				}
				break;
			case 'CURRENTNAME':
			case 'CURRENT_NAME':
				var follower_current_name = args[1];
				var len = $gameParty.battleMembers().length;
				var follower_found = false;
				for (var i = 0; i < len; i++) {
					if($gameParty.battleMembers()[i].name() == follower_current_name) {
						if(i > 0) {
							this._follower = $gamePlayer.followers().follower(i - 1);
						} else {
							this._follower = $gamePlayer;
						}
						console.log("Follower:  Move Route commands now affect " + follower_current_name + ", who is Follower", i);
						follower_found = true;
					}
				}
				if(!follower_found) {
					console.warn("Follower: Error! Unable to find a follower who is currently named", follower_current_name);
				}
				break;
			case '0':
			case '1':
			case '2':
			case '3':
			case '4':
			case '5':
			case '6':
			case '7':
			case '8':
			case '9':
			case '10':
			case '11':
			case '12':
			case '13':
			case '14':
			case '15':
			case '16':
			case '17':
			case '18':
			case '19':
			case '20':
			case '21':
			case '22':
			case '23':
			case '24':
			case '25':
			case '26':
			case '27':
			case '28':
			case '29':
			case '30':
			case '31':
			case '32':
			case '33':
			case '34':
			case '35':
			case '36':
			case '37':
			case '38':
			case '39':
			case '40':
			case '41':
			case '42':
			case '43':
			case '44':
			case '45':
			case '46':
			case '47':
			case '48':
			case '49':
			case '50':
				var follower_position = parseInt(args[0]);
				if (follower_position > 0) {
					this._follower = $gamePlayer.followers().follower(follower_position - 1);
					console.log("Follower:  Move Route commands now affect Follower", follower_position);
				} else {
					this._follower = $gamePlayer;
					console.log("Follower:  Move Route commands now affect the party Leader.");
				}
				break;
			default:
				var follower_database_name = args[0];
				var len = $gameParty.battleMembers().length;
				var follower_found = false;
				for (var i = 0; i < len; i++) {
					var actorId = $gameParty.battleMembers()[i].actorId(); //Get the actorId that belongs to this follower.
					var actor = $dataActors[actorId]; //Get the actor that belongs to that actorId.
					var actorName = actor.name; //Get the name that belongs to that actor.
					if(actorName == follower_database_name) {
						if(i > 0) {
							this._follower = $gamePlayer.followers().follower(i - 1);
						} else {
							this._follower = $gamePlayer;
						}
						console.log("Follower:  Move Route commands now affect " + follower_database_name + ", who is Follower", i);
						follower_found = true;
					}
				}
				if(!follower_found) {
					console.warn("Follower: Error! Unable to find a follower whose database actor is named", follower_database_name);
				}
		}
	}
};

//=============================================================================
// Game_Followers
//=============================================================================

// Alias method
Tyruswoo.FollowerControl.Game_Followers_initialize = Game_Followers.prototype.initialize;
Game_Followers.prototype.initialize = function() {
	Tyruswoo.FollowerControl.Game_Followers_initialize.call(this);
    this._stopChase = false;
	this._follower = $gamePlayer;
};

// Replacement method
Game_Followers.prototype.updateMove = function() {
	if (!this._stopChase) {
		for (var i = this._data.length - 1; i >= 0; i--) {
			var precedingCharacter = (i > 0 ? this._data[i - 1] : $gamePlayer);
			this._data[i].chaseCharacter(precedingCharacter);
		}
	}
};

// New method
Game_Followers.prototype.setOpacityAll = function(opacity) {
    this.forEach(function(follower) {
        follower.setOpacity(opacity);
    }, this);
};

// New method
Game_Followers.prototype.setStepAnimeAll = function(stepAnime) {
    this.forEach(function(follower) {
        follower.setStepAnime(stepAnime);
    }, this);
};

// New method
Game_Followers.prototype.setDirectionFixAll = function(directionFix) {
    this.forEach(function(follower) {
        follower.setDirectionFix(directionFix);
    }, this);
};

// New method
Game_Followers.prototype.setTransparentAll = function(transparent) {
    this.forEach(function(follower) {
        follower.setTransparent(transparent);
    }, this);
};

// New method
Game_Followers.prototype.setWalkAnimeAll = function(walkAnime) {
    this.forEach(function(follower) {
        follower.setWalkAnime(walkAnime);
    }, this);
};

// New method
Game_Followers.prototype.setBlendModeAll = function(blendMode) {
    this.forEach(function(follower) {
        follower.setBlendMode(blendMode);
    }, this);
};

// New method
Game_Followers.prototype.setMoveSpeedAll = function(moveSpeed) {
    this.forEach(function(follower) {
        follower.setMoveSpeed($gamePlayer.realMoveSpeed()); //Use the player's realMoveSpeed
    }, this);
};

//=============================================================================
// Game_Follower
//=============================================================================

// Replacement method.
Game_Follower.prototype.update = function() {
    Game_Character.prototype.update.call(this);
	if(!$gamePlayer._followers._stopChase) { //Check whether followers are chasing the player.
		this.setMoveSpeed($gamePlayer.realMoveSpeed()); //If followers are chasing the player, then make sure they all move as fast as the player.
	}
	//this.setOpacity($gamePlayer.opacity()); //Follower opacity should not be set each time Game_Follower.update() is called.
											  //If StopChase is off, opacity changes for all followers, as seen in the new Game_Player.setOpacity() function.
											  //If StopChase if on, opacity changes only for selected follower, using the processMoveCommand() function.
    //this.setBlendMode($gamePlayer.blendMode()); //Follower blendMode should not be set each time Game_Follower.update() is called.
												  //If StopChase is off, blendMode changes for all followers, as seen in the new Game_Player.setBlendMode() function.
												  //If StopChase if on, blendMode changes only for selected follower, using the processMoveCommand() function.
    //this.setWalkAnime($gamePlayer.hasWalkAnime()); //Follower walkAnime should not be set each time Game_Follower.update() is called.
													 //If StopChase is off, walkAnime changes for all followers, as seen in the new Game_Player.setWalkAnime() function.
													 //If StopChase if on, walkAnime changes only for selected follower, using the processMoveCommand() function.
    //this.setStepAnime($gamePlayer.hasStepAnime()); //Follower stepAnime should not be set each time Game_Follower.update() is called.
													 //If StopChase is off, stepAnime changes for all followers, as seen in the new Game_Player.setStepAnime() function.
													 //If StopChase if on, stepAnime changes only for selected follower, using the processMoveCommand() function.
    //this.setDirectionFix($gamePlayer.isDirectionFixed()); //Follower directionFix should not be set each time Game_Follower.update() is called.
															//If StopChase is off, directionFix changes for all followers, as seen in the new Game_Player.setDirectionFix() function.
															//If StopChase if on, directionFix changes only for selected follower, using the processMoveCommand() function.
    //this.setTransparent($gamePlayer.isTransparent()); //Follower transparency should not be set each time Game_Follower.update() is called.
														//If StopChase is off, transparency changes for all followers, as seen in the new Game_Player.setTransparent() function.
														//If StopChase if on, transparency changes only for selected follower, using the processMoveCommand() function.
};

// New method. (For followers, this method is used, instead of Game_CharacterBase.isDebugThrough.)
Game_Follower.prototype.isDebugThrough = function() { //This allows followers to travel through walls when playtesting and holding Ctrl, just like the player.
    return Input.isPressed('control') && $gameTemp.isPlaytest();
};

//=============================================================================
// Game_Character
//=============================================================================

// Replacement method
Game_Character.prototype.turnTowardCharacter = function(character) {
    var sx = this.deltaXFrom(character.x);
    var sy = this.deltaYFrom(character.y);
	if (sx === 0 && sy === 0) {
		this.setDirection($gamePlayer.direction());
	} else if (Math.abs(sx) > Math.abs(sy)) {
        this.setDirection(sx > 0 ? 4 : 6);
    } else if (sy !== 0) {
        this.setDirection(sy > 0 ? 8 : 2);
    }
};

Game_Character.prototype.moveTowardPosition = function(target_x, target_y) {
    var sx = this.deltaXFrom(target_x);
    var sy = this.deltaYFrom(target_y);
    if (Math.abs(sx) > Math.abs(sy)) {
        this.moveStraight(sx > 0 ? 4 : 6);
        if (!this.isMovementSucceeded() && sy !== 0) {
            this.moveStraight(sy > 0 ? 8 : 2);
        }
    } else if (sy !== 0) {
        this.moveStraight(sy > 0 ? 8 : 2);
        if (!this.isMovementSucceeded() && sx !== 0) {
            this.moveStraight(sx > 0 ? 4 : 6);
        }
    }
};

Game_Character.prototype.path = function(target_x, target_y) {
	switch(target_x) {
		case 'event':
		case 'Event':
		case 'EVENT':
			this.moveTowardCharacter($gameMap.event(target_y));
			break;
		case 'follower':
		case 'Follower':
		case 'FOLLOWER':
			if(target_y <= 0) {
				this.moveTowardPlayer();
			} else {
				this.moveTowardCharacter($gamePlayer.followers().follower(target_y - 1));
			}
			break;
		default:
			this.moveTowardPosition(target_x, target_y);
	};
};

//=============================================================================
// Game_Player
//=============================================================================

// Replacement method
Game_Player.prototype.jump = function(xPlus, yPlus) {
    Game_Character.prototype.jump.call(this, xPlus, yPlus);
	if (!this._followers._stopChase) {
		this._followers.jumpAll();
	}
};

// New method
Game_Player.prototype.setOpacity = function(opacity) {
    this._opacity = opacity;
	if(!this._followers._stopChase) {
		this._followers.setOpacityAll(opacity);
	}
};

// New method
Game_Player.prototype.setStepAnime = function(stepAnime) {
    this._stepAnime = stepAnime;
	if(!this._followers._stopChase) {
		this._followers.setStepAnimeAll(stepAnime);
	}
};

// New method
Game_Player.prototype.setDirectionFix = function(directionFix) {
    this._directionFix = directionFix;
	if(!this._followers._stopChase) {
		this._followers.setDirectionFixAll(directionFix);
	}
};

// New method
Game_Player.prototype.setTransparent = function(transparent) {
    this._transparent = transparent;
	if(!this._followers._stopChase) {
		this._followers.setTransparentAll(transparent);
	}
};

// New method
Game_Player.prototype.setWalkAnime = function(walkAnime) {
    this._walkAnime = walkAnime;
	if(!this._followers._stopChase) {
		this._followers.setWalkAnimeAll(walkAnime);
	}
};

// New method
Game_Player.prototype.setBlendMode = function(blendMode) {
    this._blendMode = blendMode;
	if(!this._followers._stopChase) {
		this._followers.setBlendModeAll(blendMode);
	}
};

// New method
Game_Player.prototype.setMoveSpeed = function(moveSpeed) {
    this._moveSpeed = moveSpeed;
	if(!this._followers._stopChase) {
		this._followers.setMoveSpeedAll(moveSpeed);
	}
};