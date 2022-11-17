

-- These are the DML queries for The Purple Geese CRUD Functions
-- -------------------------------------------------------------------------------------
-- dropdown selects
-- seasons
SELECT seasonID, description FROM Seasons
ORDER BY endDate
;

-- divisions
SELECT Divisions.divisionID, Divisions.description FROM Divisions
INNER JOIN SeasonsDivisions ON SeasonsDivisions.divisionID = Divisions.divisionID
INNER JOIN Seasons ON SeasonsDivisions.seasonID = Seasons.seasonID
-- optional select by season (season dropdown determines divisions available in division dropdown)
WHERE Seasons.seasonID = :selected_seasonID # selection from seasons dropdown
ORDER BY Divisions.maxAge DESC
;

-- teams
SELECT teamID, Teams.name FROM Teams
-- optional select by division (divisions dropdown determines teams available in teams dropdown)
WHERE Teams.teamDivisionID = :selectedDivisionID # select from divisions dropdown
ORDER BY Teams.name
;

-- adults
SELECT adultID, firstName, lastName FROM Adults
ORDER BY lastName;


-- volunteers by role (for headCoach/ref selection)
SELECT volunteerID, Adults.firstName, Adults.lastName FROM Volunteers
	INNER JOIN Adults ON Volunteers.adultID = Adults.adultID
    INNER JOIN Forms ON Adults.adultID = Forms.registeredAdultID
    LEFT JOIN SeasonsDivisions ON Forms.seasonDivisionID = SeasonsDivisions.seasonDivisionID
WHERE Volunteers.role = :selectedrole AND SeasonsDivisions.seasonDivisionID = :selected_divisionID
ORDER BY Adults.lastName
    ;


-- ------------------------------------------------------------------------------------
-- Seasons Page - display season information, add, update or remove season

-- display season information
SELECT  Seasons.seasonID, Seasons.description AS 'Season', CAST(startDate AS varchar(10)) AS 'StartDate',
        CAST(endDate AS varchar(10)) AS 'EndDate', seasonFee AS 'Fee' FROM Seasons
       LEFT JOIN SeasonsDivisions on Seasons.seasonID = SeasonsDivisions.seasonID
       LEFT JOIN Divisions on SeasonsDivisions.divisionID = Divisions.divisionID
        ORDER BY endDate DESC
-- option to browse by start or end date
WHERE :start_or_end_date :>_or_< :user_selected_date
-- option to select by division
INNER JOIN SeasonsDivisions ON Seasons.seasonID = SeasonsDivisions.seasonID
WHERE divisionID = :selected_division_id

-- order by the most relevant season (the one that continues longest)
ORDER BY endDate DESC
;

-- add a season - divisions must be selected from a drop down or checklist to complete the addition of a new season
-- fill all values
INSERT INTO Seasons (description, startDate, endDate, seasonFee)
VALUES (:description, :start_date, :end_date, :season_fee);

– populates a table from which divisions can be selected for the purpose of adding seasonsDivisions
SELECT divisionID, description FROM Divisions;

– adds a new entry to the intersection table
INSERT INTO SeasonsDivisions (description, seasonID, divisionID)
VALUES (:description_of_season_with_desc_of_division, 
	(SELECT seasonID FROM Seasons WHERE description = :description),
    :selecteddivisionID
    )
    ;

-- update a season, including its divisions
– right now, this is not intended to be implemented in UI; seasons are immutable
– keeping in case plans change
UPDATE Seasons
SET  description = :desc_input, startDate = :start_date_input, endDate = :endDateInput, seasonFee = :fee_input
	WHERE seasonID = :selected_season_id
;
UPDATE SeasonsDivisions
SET divisionID = :selected_division_id_from_full_dropdown
	WHERE seasonID = :selected_season_id
;
    
-- delete a season
DELETE FROM Seasons WHERE seasonID = :selected_season_id
;



-- -----------------------------------------------------------------------------------
-- Divisions page - display, add, update, or remove division

-- display division information; order by maxAge of players in division
SELECT * FROM Divisions

– optional Season filter
INNER JOIN SeasonsDivisions ON Divisions.divisionID = SeasonsDivisions.divisionID
WHERE SeasonsDivisions.seasonID = :selected_seasonID


ORDER BY maxAge DESC
;

-- add a new division
INSERT INTO Divisions (description, minAge, maxAge, gender, minPlayers, maxPlayers, ballSize, netSize)
VALUES (:description, :minAge, :maxAge, :gender_M_F_CoEd, :minPlayers, :maxPlayers, :ballSize, :netSize)
;

-- update a division
UPDATE Divisions
SET 
	description = :new_description,
	minAge = :new_minAge, 
    maxAge = :new_maxAge,
    gender = :new_gender,
    minPlayers = :new_minPlayers,
    maxPlayers = :new_maxPlayers,
    ballSize = :new_ballSize,
    netSize = :new_netSize
WHERE divisionID = :selected_divisionID
;

-- remove a division
DELETE FROM Divisions WHERE divisionID = :selected_divisionID
;




-- -----------------------------------------------------------------------------------
-- SeasonsDivisions page - view all divisions and seasons; add a division to a season

-- display seasons by division
SELECT SeasonsDivisions.seasonDivisionID, Seasons.description, Divisions.description 
FROM SeasonsDivisions
INNER JOIN Seasons ON Seasons.seasonID = SeasonsDivisions.seasonID
INNER JOIN Divisions ON Divisions.divisionID = SeasonsDivisions.divisionID
ORDER BY Divisions.maxAge, Seasons.endDate
;

-- add a division to a season
    INSERT INTO SeasonsDivisions (description, seasonID, divisionID)
VALUES (
    CONCAT((SELECT description FROM Divisions WHERE divisionID = :divisionID), ' ', 
           (SELECT description FROM Seasons WHERE seasonID = :seasonID)
           ), 
	:seasonID,
    :divisionID
    );



-- -----------------------------------------------------------------------------------
-- Accounts/Adult Page - display contact information. Update contact information. 

-- Display account holder, contact info
SELECT adultID, firstName, lastName, phone, email from Adults
ORDER BY Adults.lastName ASC
;


-- Show account holder's players and their season history
SELECT Orders.orderID, Forms.formID, Players.firstName, Players.lastName, Seasons.description, Divisions.description
FROM Orders
INNER JOIN Forms ON Orders.orderID = Forms.orderID
INNER JOIN Players ON Forms.registeredPlayerID = Players.playerID
INNER JOIN SeasonsDivisions ON Forms.seasonDivisionID = SeasonsDivisions.seasonDivisionID
    INNER JOIN Seasons ON SeasonsDivisions.seasonID = Seasons.seasonID
    INNER JOIN Divisions ON Divisions.divisionID = SeasonsDivisions.divisionID
WHERE Orders.registeringAdultID = :selectedAdultID 
;

-- Show account holder's volunteers and their season history
SELECT Orders.orderID, Forms.formID, Adults.firstName, Adults.lastName, Volunteers.role, Volunteers.details, Seasons.description, Divisions.description
FROM Orders
INNER JOIN Forms ON Orders.orderID = Forms.orderID
INNER JOIN Adults ON Forms.registeredAdultID = Adults.adultID
INNER JOIN Volunteers ON Adults.adultID = Volunteers.volunteerID
INNER JOIN SeasonsDivisions ON Forms.seasonDivisionID = SeasonsDivisions.seasonDivisionID
    INNER JOIN Seasons ON SeasonsDivisions.seasonID = Seasons.seasonID
    INNER JOIN Divisions ON Divisions.divisionID = SeasonsDivisions.divisionID
WHERE Orders.registeringAdultID = :selectedAdultID 
;

-- add adult is in the orders page, below

-- update an adult
UPDATE Adults
SET firstName = :new_firstName, lastName = :new_lastName, phone = :new_Phone, email = :new_Email
WHERE adultID = :selected_adultID
;

-- delete an adult
DELETE FROM Adults
WHERE adultID = :selected_adultID
;

-- -------------------------------------------------------------------------------------
-- Volunteer Page - display contact information for volunteers. New volunteers must be added via form. Update volunteer role. Remove volunteer status.

-- display volunteer information, contact information, team/division/season information
SELECT volunteerID, Seasons.description AS 'Season', 
	Divisions.description AS 'Division',  Teams.name AS 'Team', 
    CONCAT (Adults.firstName, ' ', Adults.lastName) AS 'Name', 
    Volunteers.role AS 'Role', Volunteers.details AS 'Details',  
    Adults.phone AS 'Phone', Adults.email AS 'email'
FROM Volunteers
LEFT JOIN Teams ON Volunteers.teamID = Teams.teamID
INNER JOIN Adults ON Volunteers.adultID = Adults.adultID
LEFT JOIN Forms ON Adults.adultID = Forms.registeredAdultID
LEFT JOIN SeasonsDivisions ON Forms.seasonDivisionID = SeasonsDivisions.seasonDivisionID
    LEFT JOIN Seasons ON SeasonsDivisions.seasonID = Seasons.seasonID
    LEFT JOIN Divisions ON Divisions.divisionID = SeasonsDivisions.divisionID

– each part of this statement should be added via dropdown before a “Go” button is pressed to call the complete read operation
WHERE Seasons.seasonID = :selected_seasonID 
AND Divisions.divisionID = :selected_divisionID 
AND Teams.teamID = :selected_teamID

– OR by selecting volunteer roles for one adult
	WHERE Adults.adultID = :selected_adultID
        ORDER BY Adults.lastName ASC, Adults.firstName ASC, Role ASC 

;

-- Volunteer player report: select players associated with selected volunteer
– 
SELECT Adults.adultID, volunteerID, Adults.firstName AS 'First Name', Adults.lastName AS 'Last Name', Players.firstName AS 'Player First Name', Players.lastName AS 'Player Last Name', Divisions.description AS 'Division', Teams.name AS 'Team'
FROM Volunteers
INNER JOIN Adults ON Volunteers.adultID = Adults.adultID
LEFT JOIN Players ON Players.primaryAdultID = Adults.adultID
LEFT JOIN Teams ON Players.playerTeamID = Teams.teamID
LEFT JOIN Forms ON Forms.registeredAdultID = Adults.adultID
LEFT JOIN SeasonsDivisions ON Forms.seasonDivisionID = SeasonsDivisions.seasonDivisionID
LEFT JOIN Seasons ON SeasonsDivisions.seasonID = Seasons.seasonID
LEFT JOIN Divisions ON SeasonsDivisions.divisionID = Divisions.divisionID
WHERE Volunteers.adultID = :selected_adultID
-- groups players for volunteers with many roles
 GROUP BY Players.playerID
ORDER BY Players.dob DESC
;

-- option: order by team
ORDER BY Teams.name ASC

-- insert is in forms page, below

-- update a volunteer record: role
UPDATE Volunteers
SET role = :new_role, details = :new_details
WHERE volunteerID = :selected_volunteerID
;

-- update a volunteer record: team
-- first, a specific dropdown for the volunteer based on division selected in form
SELECT seasonDivisionID, description FROM SeasonsDivisions
INNER JOIN Forms ON SeasonsDivisions.seasonDivisionID = Forms.seasonDivisionID
INNER JOIN Adults ON Adults.adultID = Forms.registeredAdultID
WHERE Adults.adultID = (SELECT adultID FROM adults INNER JOIN Volunteers ON Volunteers.adultID = Adults.adultID WHERE volunteerID = :selectedVolunteerID)
;

-- use team dropdown with division filter to select team
UPDATE Volunteers
SET teamID = :selected_teamID
WHERE volunteerID = :selecte_volunteerID
;

-- delete a volunteer record
-- single role
DELETE FROM Volunteers WHERE volunteerID = :selected_volunteerID
;
-- for an adult
DELETE FROM Volunteers WHERE adultID = :selected_adultID
;
-- for a team (actually an update so volunteer stays registered in role, can be reassigned)
UPDATE Volunteers
SET teamID = NULL
WHERE volunteerID = :selected_volunteerID
;



-- -------------------------------------------------------------------------------------
-- Player Page - display player name, division, team, parent and contact information. New players must be added via form. Update player name/gender/team. Remove player.
-- Options: display secondary contact

-- display player information and contact: name, division, team, parent and parent contact information
-- WHERE statement - optional to search by season/division/team
SELECT Players.playerID AS '_', Seasons.description AS 'RecentSeason', Divisions.description AS 'Division', Teams.name AS 'RecentTeam', 
        CONCAT(Players.firstName, ' ', Players.lastName) AS 'PlayerName', 
        Players.gender AS 'Gender', CAST(Players.dob AS varchar(10)) AS 'DOB',
        CONCAT(Adults.firstName, 
        ' ', Adults.lastName) as 'Guardian', Adults.phone AS 'ContactPhone', Adults.email AS 'ContactEmail' FROM Players 
        INNER JOIN Adults ON Players.primaryAdultID = Adults.adultID 
        INNER JOIN Teams ON Players.playerTeamID = Teams.teamID 
        INNER JOIN Forms ON Players.playerID = Forms.registeredPlayerID 
        INNER JOIN SeasonsDivisions ON Forms.seasonDivisionID = SeasonsDivisions.seasonDivisionID 
        INNER JOIN Seasons ON SeasonsDivisions.seasonID = Seasons.seasonID 
        INNER JOIN Divisions ON Divisions.divisionID = SeasonsDivisions.divisionID 
        ORDER BY Divisions.description ASC, Teams.name ASC, Players.lastName ASC, Players.firstName ASC 
        ;

-- option: select by season/division/team
WHERE Seasons.seasonID = :selected_seasonID 
AND Divisions.divisionID = :selected_divisionID 
	AND Teams.teamID = :selected_teamID 

– select by adult (link from Adults OR Volunteers page, with Adult ID passed to select for table)
WHERE Adults.adultID = :selected_adultID

-- order by player last name, dob (oldest sib -> youngest)
ORDER BY Players.dob DESC
ORDER BY Players.lastName ASC
;

-- option: order by team
ORDER BY Teams.name ASC

-- insert player is done through forms, below

-- update player
UPDATE Players
SET firstName = :new_firstName, lastName = :new_lastName, gender = :new_gender
WHERE playerID = :selected_playerID
;

-- update player record: team
-- first, a specific dropdown for the volunteer based on division selected in form
SELECT seasonDivisionID, description FROM SeasonsDivisions
INNER JOIN Forms ON SeasonsDivisions.seasonDivisionID = Forms.seasonDivisionID
INNER JOIN Players ON Players.playerID = Forms.registeredPlayerID
WHERE Players.playerID = :selected_playerID
;
-- then update with selected team
UPDATE Players
SET teamID = :selected_teamID
WHERE playerID = :selectedPlayerID
;
-- remove team
UPDATE Players
SET teamID = NULL
WHERE playerID = :selectedPlayerID
;

-- remove player
DELETE FROM Players WHERE playerID = :selected_playerID
;
-- ----------------------------------------------------------------------------------
-- Teams Page - display team information by season/division, Add team, Remove team, Update team name/mascot/coach

-- Display team essentials: season, division, name, head coach, currentPlayerCount (less than/more than min/max?)
SELECT Teams.teamID, Divisions.description AS division, Teams.name, Teams.mascot, Adults.firstName AS coachFirst, Adults.LastName AS coachLast, COUNT(Players.playerID) AS numPlayers
FROM Teams
LEFT JOIN Divisions ON Teams.teamDivisionID = Divisions.divisionID
LEFT JOIN Volunteers ON Teams.headCoachID = Volunteers.volunteerID
INNER JOIN Adults ON Volunteers.volunteerID = Adults.adultID
LEFT JOIN Players ON Teams.teamID = Players.playerTeamID

GROUP BY Teams.teamID
ORDER BY Teams.name
;

– optional filter for division
WHERE Teams.teamDivisionID = :selected_divisionID



-- Produce min/max ages for player/team comparison
SELECT Divisions.divisionID, Divisions.description, Divisions.minAge, Divisions.maxAge FROM Divisions 
WHERE Divisions.divisionID = :teamDivisionID
;

-- add new team
INSERT INTO Teams (name, mascot, teamDivisionID, headCoachID)
VALUES (:new_name, :new_mascot, :selected_division, 
	(SELECT volunteerID FROM Volunteers INNER JOIN Adults ON Volunteers.adultID = Adults.adultID 
		WHERE Adults.id = :selected_adultID)
)
;

-- and add a new row in volunteers; update original row with teamID for new headCoach
INSERT INTO Teams (name, mascot, teamDivisionID, headCoachID)
     VALUES (:newTeamName, :newTeamMascot, :selectedDivID, :selectedCoachID);
     
     INSERT INTO Volunteers (role, details, adultID)
    SELECT role, details, adultID FROM Volunteers
    WHERE volunteerID = :selectedCoachID; 
    
    UPDATE Volunteers
    SET teamID = 
    (SELECT teamID FROM Teams
         WHERE name = :newTeamName)
         WHERE volunteerID = :selectedCoachID;



-- update a team
UPDATE Teams
SET name = :new_name, mascot = :new_mascot, teamDivisionID = :selected_division, 
	headCoachID = :selected_headCoach
WHERE Teams.teamID = :selected_teamID
;

-- update corresponding volunteer roles in Volunteers table; delete row for head coach, duplicate and update row for new head coach
-- left in JS symbols for faster adaptation

        DELETE FROM Volunteers WHERE teamID = ${updateTeamID} AND details = 'Head Coach';
        INSERT INTO Volunteers (role, details, adultID) SELECT role, details, adultID FROM Volunteers
        WHERE volunteerID = ${coachUpdate};
        UPDATE Volunteers SET teamID = ${updateTeamID} WHERE volunteerID = ${coachUpdate};

-- remove a team
DELETE FROM Teams WHERE teamID = :selected_teamID
;


-- ---------------------------------------------------------------------------------
-- Games page - display a history of games and an upcoming schedule. Add/update/remove games

-- display a history of games
SELECT * FROM Games
WHERE dateTime < :now
;

-- display upcoming games
SELECT * from Games
WHERE dateTime >= :now
;

-- add a game
INSERT INTO Games (dateTime, fieldNumber, homeTeamID, awayTeamID, refereeID)
VALUE (:selected_dateTime, :fieldNumber, :selected_homeTeamID, :selected_awayTeamID, :selected_refereeID)
;

-- update a game
UPDATE Games
SET dateTime = :new_dateTime, fieldNumber = :new_fieldNumber, homeTeamID = :selected_homeTeamID, 
	awayTeamID = :selected_awayTeamID, refereeID = :selected_refereeID
WHERE gameID = :selected_gameID
;

-- update a score
Update Games
Set homeTeamScore = :entered_homeScore, awayTeamScore = :entered_awayScore
WHERE gameID = :selected_gameID
;

-- delete a game
DELETE FROM Games WHERE gameID = :selectedGameID
;

-- ------------------------------------------------------------------------------------
-- Orders Page - display order history, order history and invoices for selected person, add an order, delete an order


-- display order history
SELECT Adults.firstName, Adults.lastName, Orders.orderID, Orders.orderDate, Orders.orderDetails, Orders.orderTotal
FROM Orders
INNER JOIN Adults ON Orders.registeringAdultID = Adults.adultID
INNER JOIN Forms ON Orders.orderID = Forms.orderID
ORDER BY Orders.orderDate DESC
;


-- add these to previous statement to view order by player, volunteer, or adult
WHERE Forms.registeredPlayerID = :selectedPlayer
WHERE Forms.registeredAdultID = (SELECT adultID FROM Volunteers WHERE volunteerID = :selectedVolunteerID)
WHERE Adults.adultID = :selected_adult
;

-- search for existing adult
SELECT adultID FROM ADULTS
WHERE firstName = :entered_firstName AND lastName =:entered_LastName

-- add a registering adult
INSERT INTO Adults (firstName, lastName, phone, email)
VALUES (:first_name, :last_name, :phone, :email)
;

-- add an order
INSERT INTO Orders (registeringAdultID, orderDate, orderDetails, orderTotal)
VALUES (
(SELECT adultID FROM Adults WHERE Adult.firstName = :firstName AND Adult.lastName = :lastName
), :now, :comments, :count_PlayerFormstoBeSubmitted*(SELECT seasonFee FROM Seasons WHERE seasonID = :selectedID)
)
;

-- search for existing player
SELECT playerID FROM Players
WHERE firstName = :entered_firstName AND lastName = :entered_LastName
;


-- add a player
INSERT INTO Players (firstName, lastName, gender, dob, primaryAdultID)
VALUES (:player_first, :player_last, :player_gender, :player_dob, 
(SELECT adultID FROM Adults WHERE Adults.firstName = :first_name AND Adults.lastName = :last_name)
)
;

-- add a volunteer
-- prev adult, selected by reg checkbox or by search for existing adult
INSERT INTO Volunteers (adultID, role, details)
VALUES
(:selected_adultID, :role, :details)
;

-- new adult
INSERT INTO Adults (firstName, lastName, phone, email, isGuardian, connectedAdultID)
Values (
:volunteer_first, :volunteer_last, :volunteer_phone, :volunteer_email, :checked_isGuardian, 
(SELECT adultID FROM Adults WHERE Adults.firstName = :first_name AND Adults.lastName = :last_name)
)
;

INSERT INTO Volunteers (adultID, role, details)
VALUES (
(SELECT adultID FROM Adults WHERE Adult.firstName = :volunteer_first AND Adult.lastName = :volunteer_last), 
role, details
)
;

-- add a player OR volunteer form
INSERT INTO Forms (orderID, seasonDivisionID, registeredPlayerID, registeredAdultID)
VALUES (
(SELECT orderID FROM Orders WHERE registeringAdultID = :savedAdultID),
(SELECT seasonDivisionID FROM SeasonsDivisions WHERE seasonID = :selected_seasonID 
	AND divisionID = (SELECT divisionID FROM Divisions 
		WHERE :currentyear - :birthyear < maxAge AND :currentyear - :birthyear > minAge AND gender = :player_gender)),
(SELECT playerID FROM Players WHERE firstName = :player_first AND lastName = :player_last),
(SELECT adultID FROM Adults WHERE firstName =:volunteer_first AND lastName = :volunteer_last)
;



-- ------------------------------------------------------------------------------------
-- Form Page - display the order details for a single order, add a form to an active order

-- display the order details FOR PLAYERS
SELECT Forms.formID, Seasons.description, Divisions.description, Players.firstName, Players.lastName, Players.dob
FROM Forms
INNER JOIN Players ON Forms.registeredPlayerID = Players.playerID
INNER JOIN SeasonsDivisions ON Forms.seasonDivisionID = SeasonsDivisions.seasonDivisionID
INNER JOIN Seasons ON SeasonsDivisions.seasonID = Seasons.seasonID
INNER JOIN Divisions ON Divisions.divisionID = SeasonsDivisions.divisionID
WHERE Forms.orderID = :selected_order_id
;

-- display the order details FOR VOLUNTEERS
SELECT Forms.formID, Seasons.description, Divisions.description, Adults.firstName, Adults.lastName, Volunteers.role
FROM Forms
INNER JOIN Adults ON Forms.registeredAdultID = Adults.adultID
LEFT JOIN Volunteers ON Adults.adultID = Volunteers.volunteerID
INNER JOIN SeasonsDivisions ON Forms.seasonDivisionID = SeasonsDivisions.seasonDivisionID
INNER JOIN Seasons ON SeasonsDivisions.seasonID = Seasons.seasonID
INNER JOIN Divisions ON Divisions.divisionID = SeasonsDivisions.divisionID
WHERE Forms.orderID = :selected_order_id;
    
-- ------------------------------------------------------------------------------------


