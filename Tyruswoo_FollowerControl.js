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
Imported.Tyruswoo_FollowerControl = true;

var Tyruswoo = Tyruswoo || {};
Tyruswoo.FollowerControl = Tyruswoo.FollowerControl || {};

/*:
 * @plugindesc MV v3.1.1 Allows control of party follower movement, balloon icons, animations, and transfers.
 * @author Tyruswoo and McKathlin
 *
 * @param Max Party Members
 * @type number
 * @min 1
 * @desc The maximum number of party members. This includes the leader and followers. Default: 4
 * @default 4
 *
 * @help
 * Follower Control by Tyruswoo
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
 * Plugin Command: Follower Chase current //
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
 * - If transferring to the current map, then the targeted follower determines
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
 *      Makes all followers chase the leader and each other.
 *      This is the default behavior of followers.
 * 
 * Follower StopChase
 *      Makes all followers stop chasing the leader and each other.
 *      This is useful for cutscenes in which the party leader moves around
 *      alone, allowing followers and leader to all move independently.
 * 
 * Follower StopChase Selected
 *      Makes the currently selected follower stop chasing the leader.
 *      If other followers are chasing, they will continue chase and close
 *      the gap in the line, if any.
 * 
 * Follower StopChase 1
 *      Makes the first follower (i.e. the one directly after the leader)
 *      stop chasing. If other followers are chasing, they will continue
 *      chase, close the gap, etc.
 *
 * Follower StopChase 2
 *      Makes the second follower (i.e. the third party member) stop chasing.
 *      Other followers, if chasing, will continue chase.
 * 
 * Follower StopChase Charlie
 *      The actor named Charlie will stop chasing. Other followers are not
 *      affected.
 * 
 * Follower Chase Selected
 *      Makes the currently selected follower chase the leader. 
 *      The other followers' Chase / StopChase behavior will not change.
 *      Follower Chase has all the same individual syntax options that are
 *      available to Follower StopChase.
 *
 * More notes about individual StopChase and Chase:
 * * Transferring to a different area, or calling StopChase or Chase on the
 *   whole party, will cancel all individual StopChase and Chase instructions.
 * * If a Chase or StopChase action is called on the party leader,
 *   then it will apply to the entire party.
 * 
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
 *      Follow         follow         FOLLOW
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
 *
 * v2.00  January 24, 2020:
 *        This update greatly improves the pathfinding. As previously, you can
 *        use this.path() to make a follower move to specific coordinates,
 *        to a specific event, or to a specific follower. However, now the
 *        pathfinding allows avoiding obstacles. Note that in order for
 *        the follower to recgonize obstacles, you must also use the Set Move
 *        Route command to set Through Off prior to the movement. Then, use the
 *        Set Move Route command to run a Script of the this.path function.
 *       
 *        Examples of smart pathfinding that avoids obstacles:
 *
 *            this.path(17, 5)
 *              This finds the smart path to x coordinate 17, y coordinate 5.
 *
 *            this.path("event", 3)
 *              This finds the smart path to Event 3 on the current map.
 *
 *            this.path("follower", 2)
 *              This finds the smart path to Follower 2.
 *
 *        As previously, note that the follower will only move one step each
 *        time the script runs.
 *
 *        An excellent feature is that you can use this.path() not just on
 *        Set Move Route of followers, but also on the leader of the player's
 *        group, or even on any event's Set Move Route command!
 *
 *        Also importantly, if you use this in any cutscenes, the pathfinding
 *        calculation will remain the same, as long as the obstacles are in
 *        the same places!
 *
 *        You also have control over the pathfinding distance! By default,
 *        RPG Maker MV allows pathfinding of up to 12 tiles, and this is what
 *        is used to pathfind when the player uses the mouse or touchscreen to
 *        move. But, with Follower Control, you can now change the pathfinding
 *        distance for any follower, including the leader of the group, so
 *        you can allow the player to pathfind even farther if you want!
 *        You can also use this to modify how smart enemies are at pathfinding!
 *        Use this script inside a Set Move Route command:
 *
 *            this.pathMax(value)
 *
 *        Where value is how many tiles/steps you want the character to be able
 *        to pathfind around obstacles. For example:
 *
 *            this.pathMax(30)
 *
 *        The above allows pathfinding around obstacles, even if it requires
 *        looking 30 tiles around to find the best path.
 *
 *        If you want to use the previous pathfinding, which did not take
 *        obstacles into account, you can use scripts such as the following:
 *
 *        Examples of basic pathfinding that does not avoid obstacles:
 *
 *            this.moveToward(17, 5)
 *              This finds the basic path to x coordinate 17, y coordinate 5.
 *
 *            this.moveToward("event", 3)
 *              This finds the basic path to Event 3 on the current map.
 *
 *            this.moveToward("follower", 2)
 *              This finds the basic path to Follower 2.
 *
 *        Remember that each script call moves the character only one tile,
 *        i.e. only one step.
 *
 *
 * v2.1   April 19, 2020:
 *        Added a plugin parameter to control the Max Party Members. This
 *        allows you to have more than the default of 4 party members shown in
 *        the party while the player traverses the map.
 *
 * v2.2   Sept. 18, 2020:
 *        Fixed a bug in which it was possible to select a absent follower if
 *        the current $gameParty.battleMembers.length was less than
 *        $gameParty.maxBattleMembers. For example, if the Max Party Members
 *        is 4, and the current party size is 2, it was possible to select
 *        followers 2 and 3, even though they do not exist. This was not
 *        usually noticeable, because such followers are invisible. However,
 *        using Show Balloon Icon or Show Animation could cause balloons or
 *        animations to appear at the location of an absent follower.
 * 
 * v3.0   August 24, 2021:
 *        Fixed a bug that was causing crashes on save/load in some games.
 *        Ensured that move routes given to nonexistent followers are ignored.
 * 
 * v3.0.1  September 7, 2023:
 *         This plugin is now free and open source under the MIT license.
 * 
 * v3.1.0  January 18, 2024:
 *         The Chase and StopChase plugin commands can now target individual
 *         followers.
 * 
 * v3.1.1  January 29, 2024:
 *         Fixed bug where Gather Followers command made the game get stuck
 *         if any followers weren't chasing. Now Gather Followers automatically
 *         makes all party members chase.
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
 * ============================================================================
 *
 * Enjoy! :)
 *     ~Tyruswoo
 */

Tyruswoo.Parameters = PluginManager.parameters('Tyruswoo_FollowerControl');
Tyruswoo.Param = Tyruswoo.Param || {};

Tyruswoo.Param.MaxBattleMembers = Number(Tyruswoo.Parameters['Max Party Members']);

//=============================================================================
// Game_Party
//=============================================================================

// Replacement method
Game_Party.prototype.maxBattleMembers = function() {
	return Tyruswoo.Param.MaxBattleMembers;
};

//=============================================================================
// Game_Interpreter
//=============================================================================

// New properties
Object.defineProperties(Game_Interpreter.prototype, {
	followerIndex: {
		get: function() {
			return this._followerIndex;
		},
		set: function(value) {
			this._followerIndex = value;
			if (this._followerIndex > 0) {
				console.log("FollowerControl: Move Route commands now affect Follower ", this._followerIndex);
			} else if (this._followerIndex === 0) {
				console.log("FollowerControl: Move Route commands now affect the party Leader.");
			} else {
				console.warn("FollowerControl: follower index set to unexpected number " + this._followerIndex);
			}
		},
		enumerable: true
	},
	_follower: {
		get: function() {
			if (0 == this.followerIndex) {
				return $gamePlayer;
			} else if (this.followerIndex > 0 && $gamePlayer && $gamePlayer.followers) {
				if (this.followerIndex >= $gameParty.size()) {
					return null; // No one's following at this index.
				} else {
					return $gamePlayer.followers().follower(this.followerIndex - 1);
				}
			} else {
				console.warn("FollowerControl: Follower property could not find Follower "+ this.followerIndex);
				return null;
			}
		},
		set: function(value) {
			if (value === $gamePlayer) {
				this.followerIndex = 0; // party leader
			} else if (!$gamePlayer.followers() || null === value || undefined === value) {
				console.warn("FollowerControl: Couldn't set follower.");
				this.followerIndex = -1;
			} else {
				this.followerIndex = $gamePlayer.followers()._data.indexOf(value) + 1;
			}
		},
		enumerable: false
	}
});

// Alias method.
Tyruswoo.FollowerControl.Game_interpreter_clear = Game_Interpreter.prototype.clear
Game_Interpreter.prototype.clear = function() {
	Tyruswoo.FollowerControl.Game_interpreter_clear.call(this);
	this.followerIndex = 0; // party leader
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
			$gamePlayer._followers.chase();  // If player goes to a new map, followers will resume chase.
			this.followerIndex = 0;  //If player goes to a new map, reset target follower to the leader.
			$gamePlayer.reserveTransfer(mapId, x, y, this._params[4], this._params[5]);
			this.setWaitMode('transfer');
		} else if (this.followerIndex === 0) {
			if ($gamePlayer._followers.areChasing()) {
				// Transfer leader with followers.
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
			if (this._follower) {
				this._follower.locate(x, y);
				if (this._params[4] > 0) { // Set follower direction
					var d = this._params[4];
					if (!this._follower.isDirectionFixed() && d) {
						this._follower._direction = d;
					}
				}
			} else {
				console.warn("FollowerControl: No follower at index " + this._followerIndex);
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
			case 'STOPCHASE':
				doChase = args[0].toUpperCase() == 'CHASE';

				let index = -1;
				if (/^(CURRENT|SELECTED)$/i.test(args[1])) {
					index = this.followerIndex;
				} else if (/^\d+$/.test(args[1])) {
					index = parseInt(args[1]);
				} else {
					index = $gamePlayer._followers.getIndexByActorName(args[0]);
				}

				if (index > 0) {
					// The index corresponds to a follower.
					// Set chase for that one follower.
					let follower = $gamePlayer._followers.follower(index - 1);
					if (follower) {
						follower.setChase(doChase);
					}
				} else {
					// The index is 0 (the leader) or -1 (unset).
					// Set chase for all followers.
					$gamePlayer._followers.setChase(doChase);
				}
				break;
			case 'VARIABLE':
				var variableId = parseInt(args[1]);
				this.followerIndex = $gameVariables.value(variableId); // Update v 3.0
				break;
			case 'ACTOR':
				var actorId = parseInt(args[1]);
				var len = $gameParty.battleMembers().length;
				var follower_found = false;
				for (var i = 0; i < len; i++) {
					if($gameParty.battleMembers()[i].actorId() == actorId) {
						this.followerIndex = i; // Update v 3.0
						console.log("Follower:  Move Route commands now affect Actor " + actorId + ", who is Follower", i);
						follower_found = true;
					}
				}
				if(!follower_found) {
					console.warn("Follower: Error! Unable to find a follower with Actor ID", actorId);
				}
				break;
			case 'POSE':
				var actor = $gameParty.members()[this.followerIndex]; // Update v 3.0
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
				for (var i = 0; i < len && !follower_found; i++) {
					if ($gameParty.battleMembers()[i].name() == follower_current_name) {
						this.followerIndex = i; // Update v 3.0
						console.log("Follower:  Move Route commands now affect " + follower_current_name + ", who is Follower", i);
						follower_found = true;
					}
				}
				if (!follower_found) {
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
				this.followerIndex = parseInt(args[0]); // Update: v 3.0
				break;
			default:
				let myIndex = $gamePlayer._followers.getIndexByActorName(args[0]);
				if (myIndex >= 0) {
					this.followerIndex = myIndex;
				} else {
					console.warn("Follower: Error! Unable to find a follower whose database actor is named", follower_database_name);
				}
		} // end switch statement
	} // endif command is "FOLLOW" or "FOLLOWER"
};

//=============================================================================
// Game_Followers
//=============================================================================

// Alias method
Tyruswoo.FollowerControl.Game_Followers_initialize = Game_Followers.prototype.initialize;
Game_Followers.prototype.initialize = function() {
	Tyruswoo.FollowerControl.Game_Followers_initialize.call(this);
	this._stopChase = false;
};

// New method
Game_Followers.prototype.areChasing = function() {
	return !this._stopChase;
};

Game_Followers.prototype.setChase = function(doChase=true) {
	// Set chase for all followers
	this._stopChase = !doChase;
	this.forEach(function(follower) {
		// Remove individual chase toggles; do what the group is doing.
		follower.resetChase();
	}, this);
}

// New method
// Stop chasing the leader.
Game_Followers.prototype.stopChase = function() {
	this.setChase(false);
};

// New method
// Resume chasing the leader.
Game_Followers.prototype.chase = function() {
	this.setChase(true);
};

// New method
// Given an actor name, find their index in the party
Game_Followers.prototype.getIndexByActorName = function(targetName) {
	// TODO: Revise to work for non-combat followers as well
	var len = $gameParty.battleMembers().length;
	for (var i = 0; i < len; i++) {
		var actorId = $gameParty.battleMembers()[i].actorId(); // Get the actorId that belongs to this follower.
		var actor = $dataActors[actorId]; // Get the actor that belongs to that actorId.
		var actorName = actor.name; // Get the name that belongs to that actor.
		if (actorName == targetName) {
			return i;
		}
	}
	// If we're here, no actor by that name was found among these followers.
	return -1;
};

// Replacement method
Game_Followers.prototype.updateMove = function() {
	chaseList = this._data.filter((follower) => follower.isChasing())
	for (var i = chaseList.length - 1; i >= 0; i--) {
		var precedingCharacter = (i > 0 ? chaseList[i - 1] : $gamePlayer);
		chaseList[i].chaseCharacter(precedingCharacter);
	}
};

// Alias method
// Resume chase before gathering.
// This prevents getting stuck waiting for gathering that won't happen.
Tyruswoo.FollowerControl.Game_Followers_gather =
	Game_Followers.prototype.gather;
Game_Followers.prototype.gather = function() {
	this.chase();
	Tyruswoo.FollowerControl.Game_Followers_gather.call(this);
};

// Replacement method
// Chasing followers will jump; non-chasing followers will not jump.
Game_Followers.prototype.jumpAll = function() {
	if ($gamePlayer.isJumping()) {
		for (var i = 0; i < this._data.length; i++) {
			var follower = this._data[i];
			if (follower.isChasing()) {
				var sx = $gamePlayer.deltaXFrom(follower.x);
				var sy = $gamePlayer.deltaYFrom(follower.y);
				follower.jump(sx, sy);
			}
		}
	}
};

// New method
Game_Followers.prototype.setOpacityAll = function(opacity) {
	this.forEach(function(follower) {
		if (follower.isChasing()) {
			follower.setOpacity(opacity); 
		}
	}, this);
};

// New method
Game_Followers.prototype.setStepAnimeAll = function(stepAnime) {
	this.forEach(function(follower) {
		if (follower.isChasing()) {
			follower.setStepAnime(stepAnime);
		}
	}, this);
};

// New method
Game_Followers.prototype.setDirectionFixAll = function(directionFix) {
	this.forEach(function(follower) {
		if (follower.isChasing()) {
			follower.setDirectionFix(directionFix);
		}
	}, this);
};

// New method
Game_Followers.prototype.setTransparentAll = function(transparent) {
	this.forEach(function(follower) {
		if (follower.isChasing()) {
			follower.setTransparent(transparent);
		}
	}, this);
};

// New method
Game_Followers.prototype.setWalkAnimeAll = function(walkAnime) {
	this.forEach(function(follower) {
		if (follower.isChasing()) {
			follower.setWalkAnime(walkAnime);
		}
	}, this);
};

// New method
Game_Followers.prototype.setBlendModeAll = function(blendMode) {
	this.forEach(function(follower) {
		if (follower.isChasing()) {
			follower.setBlendMode(blendMode);
		}
	}, this);
};

// New method
Game_Followers.prototype.setMoveSpeedAll = function(moveSpeed) {
	this.forEach(function(follower) {
		if (follower.isChasing()) {
			follower.setMoveSpeed($gamePlayer.realMoveSpeed()); //Use the player's realMoveSpeed
		}
	}, this);
};

//=============================================================================
// Game_Follower
//=============================================================================

// New method
// Set this individual follower's chase.
Game_Follower.prototype.setChase = function(doChase=true) {
	this._stopChase = !doChase;
}

// New method
// This individual follower will start chasing the leader.
Game_Follower.prototype.chase = function() {
	this._stopChase = false;
};

// New method
// This individual follower will stop chasing the leader.
Game_Follower.prototype.stopChase = function() {
	this._stopChase = true;
};

// New method
// This individual follower will chase or not,
// depending on what the Followers group is doing.
Game_Follower.prototype.resetChase = function() {
	this._stopChase = null;
};

// New method
Game_Follower.prototype.isChasing = function() {
	if (true === this._stopChase) {
		return false;
	} else if (false === this._stopChase) {
		return true;
	} else if ($gamePlayer && $gamePlayer._followers) {
		// When this._stopChase is null or undefined,
		// the Follower defaults to the whole Followers group's behavior.
		return $gamePlayer._followers.areChasing();
	} else {
		return true; // Chasing is followers' default behavior.
	}
};

// Replacement method
Game_Follower.prototype.update = function() {
	Game_Character.prototype.update.call(this);
	if (this.isChasing()) { // Check whether this follower is chasing the player.
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
// Game_CharacterBase
//=============================================================================


// Alias method
Tyruswoo.FollowerControl.Game_CharacterBase_initMembers = Game_CharacterBase.prototype.initMembers;
Game_CharacterBase.prototype.initMembers = function() {
	Tyruswoo.FollowerControl.Game_CharacterBase_initMembers.call(this);
	this._searchLimit = 12; //We define a pathfinding searchLimit variable for each character.
};

// New method
Game_CharacterBase.prototype.pathMax = function(value = 12) {
	if (value && value > 0) {
		this._searchLimit = value; //Set the searchLimit for this character.
	} else {
		this._searchLimit = 12; //Default searchLimit.
	};
};

//=============================================================================
// Game_Character
//=============================================================================

// Replacement method
// By default, the searchLimit for pathfinding is always 12.
// Let us make the searchLimit unique to each character. That way, we can allow a script to change a character's searchLimit.
Game_Character.prototype.searchLimit = function() {
	return this._searchLimit;
};

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

// New method
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

// New method
// This method used to be the path method used in Follower Control v1.09, but has been renamed as moveToward,
// because the improved path method of Follower Control v2.00 allows for avoiding obstacles.
Game_Character.prototype.moveToward = function(target_x, target_y) {
	switch(target_x) {
		case 'event': //If target_x is the word 'event', then target_y is the event's ID number.
		case 'Event':
		case 'EVENT':
			this.moveTowardCharacter($gameMap.event(target_y));
			break;
		case 'follower': //If target_x is the word 'follower', then target_y is the follower's marching order.
		case 'Follower':
		case 'FOLLOWER':
			if(target_y <= 0) {
				this.moveTowardPlayer();
			} else {
				this.moveTowardCharacter($gamePlayer.followers().follower(target_y - 1));
			}
			break;
		default: //By default, the target_x is an x coordinate on the map, and the target_y is a y coordinate on the map.
			this.moveTowardPosition(target_x, target_y);
	};
};

// New method
// This is the path method as of Follower Control v2.00. This method allows avoiding obstacles.
// Keep in mind that the character must have Through Off in order to recognize obstacles in pathfinding.
Game_Character.prototype.path = function(target_x, target_y) {
	var direction = 0;
	switch(target_x) {
		case 'event': //If target_x is the word 'event', then target_y is the event's ID number.
		case 'Event':
		case 'EVENT':
			var targetCharacter = $gameMap.event(target_y);
			direction = this.findDirectionTo(targetCharacter.x, targetCharacter.y);
			break;
		case 'follower': //If target_x is the word 'follower', then target_y is the follower's marching order.
		case 'Follower':
		case 'FOLLOWER':
			if(target_y <= 0) {
				var targetCharacter = $gamePlayer;
				direction = this.findDirectionTo(targetCharacter.x, targetCharacter.y);
			} else {
				var targetCharacter = $gamePlayer.followers().follower(target_y - 1);
				direction = this.findDirectionTo(targetCharacter.x, targetCharacter.y);
			}
			break;
		default: //By default, the target_x is an x coordinate on the map, and the target_y is a y coordinate on the map.
			direction = this.findDirectionTo(target_x, target_y);
	};
	if( direction > 0) {
		this.executeMove(direction);
	};
};

// New method
// This method is modeled on the Game_Player.executeMove function.
Game_Character.prototype.executeMove = function(direction) {
	this.moveStraight(direction);
};

//=============================================================================
// Game_Player
//=============================================================================

// New method
Game_Player.prototype.setStepAnime = function(stepAnime) {
	this._stepAnime = stepAnime;
	this._followers.setStepAnimeAll(stepAnime);
};

// New method
Game_Player.prototype.setDirectionFix = function(directionFix) {
	this._directionFix = directionFix;
	this._followers.setDirectionFixAll(directionFix);
};

// New method
Game_Player.prototype.setTransparent = function(transparent) {
	this._transparent = transparent;
	this._followers.setTransparentAll(transparent);
};

// New method
Game_Player.prototype.setWalkAnime = function(walkAnime) {
	this._walkAnime = walkAnime;
	this._followers.setWalkAnimeAll(walkAnime);
};

// New method
Game_Player.prototype.setBlendMode = function(blendMode) {
	this._blendMode = blendMode;
	this._followers.setBlendModeAll(blendMode);
};

// New method
Game_Player.prototype.setMoveSpeed = function(moveSpeed) {
	this._moveSpeed = moveSpeed;
	this._followers.setMoveSpeedAll(moveSpeed);
};
