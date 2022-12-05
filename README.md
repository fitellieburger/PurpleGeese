GETS in All Entities

POSTS in All Entities

UPDATES in Adults, Players, **Volunteers**, Teams, Divisions, Games

DELETES in Adults, Players, **Volunteers**, Teams, Divisions, Games, **SeasonsDivisions**


Add'l Features:
-drop-downs are in alphabetical order
-buttons jump to add forms
-multiselect in players and volunteers
-teams adds a volunteer line for the head coach
-games shows names, not ids (hope this is okay - I built on your /get)

Most tables are in alphabetical or chronological order - we can discuss this and other changes if we decide to go with this format

Known issues(flagging, may not need updating):
Orders must be refreshed for drop-downs to update, but adds may require the first form to update the drop-downs for the user

Games cannot create with time
Games updates require user to re-enter date *and* time completely --- would it be a simple matter to update score only *if* a change is warranted?

Adults has last reference FK, in the connectedAdultsID column. Could be reworked to display name with a self join?
