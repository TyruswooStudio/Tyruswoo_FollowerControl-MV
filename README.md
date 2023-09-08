## WARNING: This is an older version!
It lacks the features and improvements of this plugin's later versions.
To get the latest version for free, visit
[Tyruswoo.com](https://www.tyruswoo.com).

# Tyruswoo Follower Control plugin v2.1.1 for RPG Maker MV

Tyruswoo's Follower Control plugin allows greater control of party
follower movement.  It allows using these commands on any follower:
- Set Move Route
- Show Balloon Icon
- Show Animation
- Transfer Player

Now you can easily make cool cutscenes involving the party's followers and leader!

## Plugin commands in brief

| Command Syntax              | Description                                        |
|-----------------------------|----------------------------------------------------|
| `Follower 0`                | Target the leader (for Set Move Route of player)   |
| `Follower 1`                | Target follower 1 (for Set Move Route of player)   |
| `Follower 2`                | Etc.  Works for up to 50 followers.                |
| `Follower StopChase`        | Followers stop chasing the leader.                 |
| `Follower Chase`            | Followers chase the leader again.                  |
| `Follower <Name>`           | Target follower associated with actor named <Name> |
| `Follower Variable <varId>` | Target follower based on value of a variable       |
| `Follower Actor <actorId>`  | Target follower associated with actor <actorId>    |
| `Follower Pose <poseName>`  | Change the current follower's pose                 |
| `Follower Pose default`     | Return the current follower's pose to normal       |

For best results, use the above Plugin Commands in combination with
`Set Move Route` command.  Make cool cutscenes!  :)

## Example of how to use this plugin

Here is an example of using the Plugin Commands,
combined with the Set Move Route command.

Use the following commands within an event:

```
Plugin Command: Follower StopChase  // * This changes follower behavior.
                             //   They no longer follow the leader.
Plugin Command: Follower 1      // * This makes the Set Move Route command
                         //   target Follower 1 instead of the leader.
(Now Set Move Route of player.) // * Instead of the party leader, follower 1
                         //   will move independently.
Plugin Command: Follower 0      // * This resets how Set Move Route works.
                         //   Now it will target the leader again.
(Now Set Move Route of player.) // * The party leader will move, but the
                         //   followers will not chase the leader,
                         //   since we used "Follower StopChase".
Plugin Command: Follower Chase  // * Resets follower behavior, so they
                         //   chase the leader again.
```

Details of Plugin Commands to target a follower instead of the leader
for Set Move Route, Show Balloon Icon, Show Animation, or Transfer Player
commands.

Example:
`Follower 1` will make all future Set Move Route commands
affect the first follower, i.e. the character following the party leader.
This effect will continue until `Follower 0`, which causes default behavior
of all Move Route event commands affecting the party leader.

**Important:** Make sure you use plugin command "Follower 0" to reset, so
that future Set Move Route commands will affect the party leader!

### Number Codes 

| Code | Party Position  |
|------|-----------------|
|    0 | Leader          |
|    1 | First Follower  |
|    2 | Second Follower |
|    3 | Third Follower  |
|    4 | Fourth Follower |
|    5 | Fifth Follower  |

And so on for up to 50 followers.

If the selected follower is not present (i.e. the party is too small, and
that follower spot is not filled), then commands sent to that follower number
will have no effect.

## Notes on Transfer Player

No matter the follower/leader targeted, using a Transfer Player to go to
  a new map will always rejoin the party, making the followers chase the
  leader again, and setting the leader as the target (same as using
  Plugin Command `Follower 0`).

If transferring to the current map, then the targeted follower determines
the effect of Transfer Player.
* If the leader is targeted (Follower 0), then we check whether
  followers are chasing.
    - If they are chasing, then we perform a Transfer Player type
      function, bringing the party together and performing the
      chosen fade.
    - If the followers are not chasing, then the leader is
      teleported without affecting the followers' positions.
* If a follower is targeted, then the follower is teleported
  without affecting the other followers' or leader's position.

**Tip:**  If you want to transfer the followers and leader all independently
    during a cutscene, then be sure to use Plugin Command "Follower
    StopChase".  That way, transfers of the leader within the same map
    will no longer affect the followers, allowing for better cutscenes.
    (Note that this also works with TYR_CameraControl, allowing for
    the camera to stay focused on the correct camera target.)

## Details of Plugin Commands to make followers stop and start following

**Follower Chase**
- Makes all followers chase the leader and each other.  This is the
  default behavior of followers.

**Follower StopChase**
- Makes all followers stop chasing the leader and each other.  This
  is useful for cutscenes in which the party leader moves around
  alone, allowing followers and leader to all move independently.

## Details of alternative ways to select a follower

### `Follower Variable variableID`
     
Where `variableId` is the ID number of the desired variable.
This will use Variable variableId to determine which follower to
select. If Variable variableId has not been set, then it will be 0,
which will select the leader. If Variable variableId has been set to 3,
then follower 3 will be selected. Etc. In this way, the Control Variables
event command can be used to set a variable Id, which in turn selects
a follower.

**Examples:**
- `Follower Variable 3`: This uses variable 3 to determine the follower. Set variable 3
  to the desired follower, then use this command to set the
  selected follower to the value of Variable 3.
- `Follower Variable 27`: Same as above, but variable 27 is used. If variable 27 has
  not been set, it will be 0, and the leader will be selected.
  If variable 27 has been set to 1, then the first follower
  will be selected. Etc.

This can also be used in combination with event Loops to cycle through
all followers in turn.

### `Follower Name`

where `Name` is the name of the follower's associated actor, as recorded in
the database.

Examples:
- `Follower Harold`: This will select whichever follower is associated with
  the actor named Harold.
- `Follower Marsha`: This will select whichever follower is associated with
  the actor named Marsha.

This can be useful for certain cutscenes. For example, if you want a
certain follower to have a question mark bubble, or to do a jump
before speaking, etc, you can select that follower even if you do not
know their position in the group. This can be helpful if you allow
the player to alter the marching order of their characters' party.

### `Follower CurrentName EnteredName`

where `EnteredName` is the current name of the follower's associated actor,
as it is recorded in the savefile currently loaded.

You can, if so desired, search for an actor based on their
current name. A potential reason to use this method is if
you want special things to occur only when an actor has a special
name that the player has entered in. For example, either of the
following will select a follower who is currently named "SecretCode".

```
Follower CurrentName SecretCode
Follower Current_Name SecretCode
```

If a player has indeed renamed an actor to be named "SecretCode",
then the follower associated with that actor will be selected.

### `Follower Actor ID`

where `ID` is the ID number of the follower's associated actor.

**Examples:**
- `Follower Actor 2`: This will select whichever follower is associated with
  the actor of actorID number 2.
- `Follower Actor 39`: This will select whichever follower is associated with
  the actor of actorID number 39.

This can be useful just like selecting a follower by name, as described
above. However, by using an actor ID, we can select the desired actor,
even if the name of the actor has been modified. This is useful for
games that allow the player to change the names of all their actors.

### Synonyms

Here are a few alternate ways to write the same plugin command:

For the term "Follower", you may type any of these:
```
     Follower       follower       FOLLOWER
     Follow         follow         FOLLOW
```

For the term "Chase", you may type any of these:
```
     Chase          chase          CHASE
     Chase True     chase true     CHASE TRUE
     Chase Start    chase start    CHASE START
```

For the term "StopChase", you may type any of these:
```
     StopChase      stopchase      STOPCHASE
     stopChase      Stopchase
     Chase False    chase false    CHASE FALSE
     Chase Stop     chase stop     CHASE STOP
```

## Follower Pose Commands

The `Follower Pose` switches the image of the currently selected follower,
based on the currently selected follower's default image.

To use poses, you first need to create the appropriately named
pose image files. Then, you can call those files for your
follower at any time. The follower's default image will be used
to determine what their poses can be.

You can create an infinite number of your own poses! To create a
pose, you need to have the default image file for the character,
and then create another image file with an underscore added at
the end, followed by the name of the pose (in lowercase letters).
For example, if our character's default image is `$McKathlinIsAwesome.png`,
then our pose image for a wink should be named `$McKathlinIsAwesome_wink.png`.
Or, our pose image for that character's wounded image should be
`$McKathlinIsAwesome_wounded.png`.
  
And likewise for any other pose images for that character. You can
have as many poses as you want! There is no maximum.

**Important Note:** The poses must all have the same index value as the
default pose. In other words, the pose images must be the same size
as the default image, with the pose at the same position within the
image file.

For example, if we want to make a certain follower wink, we first
select the follower. Then, make that follower change to a wink
pose:

`Follower Pose wink`

Have the follower hold the pose for a moment or say something, etc,
then return the follower to a default pose. There are several ways
to do this, and all are equivalent:

```
Follower Pose default
Follower Pose normal
Follower Pose none
Follower Pose stand
Follower Pose standing
```

All of the above plugin commands do the same thing of returning
the follower to their default pose.

## Pathfinding Script Calls

From Version 2.0 onward, pathfinding now allows avoiding obstacles.
Note that in order for the follower to recgonize obstacles,
you must also use the Set Move Route command to set Through Off
prior to the movement. Then, use the Set Move Route command to
run a Script of the `this.path` function.

Each time the script runs, the follower will move **one step** towards its target.

First, select the desired Follower. Then, within the
  Set Move Route command, use the script call `this.path` in one of these ways:
- `this.path(17, 5)` finds the path to x coordinate 17, y coordinate 5.
- `this.path("event", 3)` finds the path to Event 3 on the current map.
- `this.path("follower", 2)` finds the path to Follower 2.

For whichever of the above pathing arguments you use,
the player or follower will only move one step each time
you call the script. You can use the script as many times
as you need, in order to make the player or follower step
toward the target for that many steps.
- **Note:** This script call also works for events. Just use the script
  call within Set Move Route.
- **Note:** This script call has no variability, so it always
  finds the straightest path, and will always yield the same result
  every time. (This is different from the "Approach" movement type,
  which has randomness, producing variability.)

You can use the script call `this.path()` to make a follower move to specific
coordinates, to a specific event, or to a specific follower.

An excellent feature is that you can use `this.path()` not just on
Set Move Route of followers, but also on the leader of the player's
group, or even on any event's Set Move Route command!

Also importantly, if you use this in any cutscenes, the pathfinding
calculation will remain the same, as long as the obstacles are in
the same places!

You also have control over the pathfinding distance! By default,
RPG Maker MV allows pathfinding of up to 12 tiles, and this is what
is used to pathfind when the player uses the mouse or touchscreen to
move. But, with Follower Control, you can now change the pathfinding
distance for any follower, including the leader of the group, so
you can allow the player to pathfind even farther if you want!
You can also use this to modify how smart enemies are at pathfinding!
Use this script inside a Set Move Route command:

`this.pathMax(value)`

Where value is how many tiles/steps you want the character to be able
to pathfind around obstacles. For example:

`this.pathMax(30)`

The above allows pathfinding around obstacles, even if it requires
looking 30 tiles around to find the best path.

If you want to use the previous pathfinding, which did not take
obstacles into account, you can use scripts such as the following:

Examples of basic pathfinding that does not avoid obstacles:

    this.moveToward(17, 5)
      This finds the basic path to x coordinate 17, y coordinate 5.

    this.moveToward("event", 3)
      This finds the basic path to Event 3 on the current map.

    this.moveToward("follower", 2)
      This finds the basic path to Follower 2.

Remember that each script call moves the character only one tile,
i.e. only one step.

## Version History

v1.00 - January 17, 2016:
Created the plugin and added the following features:
- Plugin command "Follower" to select followers.
- Set Move Route effect on followers.
- Plugin commands "StopChase" and "Chase" to control followers
  chasing the leader.

v1.01 - January 19, 2016:
Added the following features:
- Show Balloon Icon for followers.
- Show Animation for followers.
- Transfer Player for followers.

v1.02 - January 19, 2016:
- Worked on fixing a bug.  However, errors still occured.  See below.

v1.03 - January 20, 2016:
- Fixed the bug found on January 19th.
- Previously, the "Follower" plugin command had to be used prior to
  ever using Set Move Route or other featured commands in your game;
  If the "Follower" plugin command was not used first, the game would
  freeze.  Now, the plugin no longer requires this!  If you never
  use a "Follower" plugin command, your game will function as it
  would by default, without errors.

v1.04 - January 20, 2016:
- Added feature: If a follower is on the same tile as the leader,
  and then Set Move Route is used to "Turn toward Player", then the
  follower will now turn to face the same direction as the leader!
  So, by using the Gather Followers event command, then using
  Set Move Route "Turn toward Player", it is possible to make
  followers be in a predictable position (right where the leader is),
  from whence the followers can then be sent out in a pre-prepared
  formation. This allows for ease of creating Common Events for
  for your various formations of follower movement!

v1.05 - Sept. 4, 2018:
- Added feature: when StopChase is on, and the leader's MoveRoute is
  caused to jump, the followers will not jump.

v1.06 - Dec. 22, 2018:
- Added feature: select follower based on a variable's value, using
  the `Follower Variable <variableId>` plugin command.
- Added feature: select follower based on their actor's name, using
  the `Follower <Name>` plugin command.

v1.07 - Dec. 31, 2018:
Added feature: select follower based on an actor's ID, using
  the `Follower Actor <actorId>` plugin command.

v1.08 - Feb. 27, 2019:
Added feature/fixed bug:
- Followers can be set to have unique qualities of the following,
  using Set Move Route:
    - Opacity
    - Blend Mode
    - Walk Animation On/Off
    - Step Animation On/Off
    - Direction Fix On/Off
    - Transparency On/Off
  For these qualities, followers will retain their individual
  qualities. However, if StopChase is Off, and one of these
  qualities is applied to the player, then the same quality
  will be applied to all followers, as well. Therefore, if you
  want to apply any of the above qualities to only the leader,
  StopChase must be On.
- Also, followers will now retain their own Move Speed as long as
  StopChase is On, even if the followers are moving and the player
  is moving at the same time. (However, unlike the above qualities,
  if StopChase is turned back Off, followers will immediately
  be reset to the player's Move Speed.)

v1.09 - March 8, 2019:
Added feature:
- Added script call `this.path`, which can be used within the
  Set Move Route command to make any follower pathfind to any
  coordinates on the map, to any of the current map's events,
  or to any follower. 

v1.10 - June 23, 2019:
- Added `Follower Pose` command.

v1.11  August 2, 2019:
Modified feature: There are now two ways to select a follower by
their name: by their original name as listed in the database,
or by their current name.

v2.00  January 24, 2020:
- Significant improvements to pathfinding.

v2.1 - April 19, 2020:
- Added a plugin parameter to control the Max Party Members. This
  allows you to have more than the default of 4 party members shown in
  the party while the player traverses the map.

v2.1.1 - September 7, 2023
- This older plugin version is now free and open source under the MIT license.