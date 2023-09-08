## WARNING: This is an older version!
It lacks the features and improvements of this plugin's later versions.
To get the latest version for free, visit
[Tyruswoo.com](https://www.tyruswoo.com).

# Tyruswoo Follower Control plugin v1.8.1 for RPG Maker MV

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
| `Follower Actor <actorId>`  | Target follower associated with actor `<actorId>`  |

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

v1.8.1 - September 7, 2023
- This older plugin version is now free and open source under the MIT license.