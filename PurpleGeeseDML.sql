

-- These are the DML queries for The Purple Geese CRUD Functions
-- -------------------------------------------------------------------------------------
-- dropdown selects
-- seasons
SELECT seasonID, description FROM Seasons
ORDER BY endDate DESC
;

-- divisions
SELECT Divisions.divisionID, Divisions.description FROM Divisions
ORDER BY Divisions.maxAge DESC
;

-- teams
SELECT * FROM Teams
ORDER BY Teams.name
;

-- adults
SELECT adultID, firstName, lastName FROM Adults
ORDER BY lastName;

-- volunteer roles
SELECT role FROM Volunteers
GROUP BY role
ORDER BY role;

-- volunteers by role (for headCoach/ref selection)
SELECT volunteerID, concat (Adults.firstName, Adults.lastName) AS ':hardcodedrole' FROM Volunteers
INNER JOIN Adults ON Volunteers.adultID = Adults.adultID
WHERE Volunteers.role = :hardcodedRole
GROUP BY Adults.adultID
ORDER BY Adults.lastName, Adults.firstName;



-- ------------------------------------------------------------------------------------
-- Seasons Page - display season information, add, update or remove season

-- display season information
SELECT  Seasons.seasonID AS '_', Seasons.description AS 'Season', CAST(startDate AS varchar(10)) AS 'StartDate',
        CAST(endDate AS varchar(10)) AS 'EndDate', seasonFee AS 'Fee' FROM Seasons
       LEFT JOIN SeasonsDivisions on Seasons.seasonID = SeasonsDivisions.seasonID
       LEFT JOIN Divisions on SeasonsDivisions.divisionID = Divisions.divisionID
        ORDER BY endDate DESC
        ;

-- option to select by division
SELECT  Seasons.seasonID AS '_', Seasons.description AS 'Season', CAST(startDate AS varchar(10)) AS 'StartDate',
         CAST(endDate AS varchar(10)) AS 'EndDate', seasonFee AS 'Fee' FROM Seasons
        INNER JOIN SeasonsDivisions on Seasons.seasonID = SeasonsDivisions.seasonID
        INNER JOIN Divisions on SeasonsDivisions.divisionID = Divisions.divisionID
        WHERE Divisions.divisionID LIKE :selected_divisionID 
        ORDER BY endDate DESC 
        ;

-- add a season - divisions must be selected from a drop down or checklist to complete the addition of a new season
-- fill all values
INSERT INTO Seasons (description, startDate, endDate, seasonFee)
VALUES (:input_description, :input_start_date, :input_end_date, :input_season_fee);


-- adds a new entry to the intersection table
INSERT INTO SeasonsDivisions (description, seasonID, divisionID)
VALUES (CONCAT((SELECT description FROM Divisions WHERE divisionID = :selected_divisionID), ' ', 
               (SELECT description FROM Seasons WHERE seasonID = :selected_seasonID})
               ), 
	:selected_seasonID
    :selected_divisionID)
    ;

-- update a season, including its divisions
-- right now, this is not intended to be implemented in UI; seasons are immutable
UPDATE Seasons
SET  description = :desc_input, startDate = :start_date_input, endDate = :endDateInput, seasonFee = :fee_input
	WHERE seasonID = :selected_season_id
;
    
-- delete a season
DELETE FROM Seasons WHERE seasonID = :selected_season_id
;


-- -----------------------------------------------------------------------------------
-- Divisions page - display, add, update, or remove division

-- display division information; order by maxAge of players in division
SELECT * FROM Divisions
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

-- display all division/season combinations
SELECT SeasonsDivisions.seasonDivisionID AS'_', Seasons.description AS 'Season',
        Divisions.description AS 'Division', 
       CAST(startDate AS varchar(10)) AS 'StartDate',
       CAST(endDate AS varchar(10)) AS 'EndDate'
       FROM SeasonsDivisions
       INNER JOIN Seasons ON Seasons.seasonID = SeasonsDivisions.seasonID
       INNER JOIN Divisions ON Divisions.divisionID = SeasonsDivisions.divisionID
       ORDER BY Seasons.endDate, Divisions.maxAge
        ;

-- display seasons by division
SELECT SeasonsDivisions.seasonDivisionID AS'_', Seasons.description AS 'Season',
        Divisions.description AS 'Division', 
       CAST(startDate AS varchar(10)) AS 'StartDate',
       CAST(endDate AS varchar(10)) AS 'EndDate'
       FROM SeasonsDivisions
       INNER JOIN Seasons ON Seasons.seasonID = SeasonsDivisions.seasonID
       INNER JOIN Divisions ON Divisions.divisionID = SeasonsDivisions.divisionID
        WHERE Divisions.divisionID LIKE :selected_divisionID
        ORDER BY Seasons.endDate, Divisions.maxAge
        ;

-- add a division to a season
    INSERT INTO SeasonsDivisions (description, seasonID, divisionID)
VALUES (
    CONCAT((SELECT description FROM Divisions WHERE divisionID = :selected_divisionID), ' ', 
           (SELECT description FROM Seasons WHERE seasonID = :selected_seasonID)
           ), 
	:selected_seasonID,
    :selected_divisionID
    );
    
-- delete a division from a season
DELETE FROM SeasonsDivisions WHERE seasonDivisionID = :selected_seasonID;


-- -----------------------------------------------------------------------------------
-- Accounts/Adult Page - display contact information. Update contact information. 

-- Display account holder, contact info
SELECT * from Adults
ORDER BY Adults.lastName, Adults.firstName ASC
;

-- add adult is in the orders page, below

-- update an adult
UPDATE Adults
SET firstName = :new_firstName, lastName = :new_lastName, phone = :new_Phone, email = :new_Email,
isGuardian = :new_guardian, connectedAdultID = :new_connection
WHERE adultID = :selected_adultID
;

-- delete an adult
DELETE FROM Adults
WHERE adultID = :selected_adultID
;

-- -------------------------------------------------------------------------------------
-- Volunteer Page - display contact information for volunteers. New volunteers must be added via form. Update volunteer role. Remove volunteer status.

-- display volunteer information, contact information, team/division/season information
SELECT volunteerID AS '_', Seasons.description AS 'Season', 
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
ORDER BY Adults.lastName ASC, Adults.firstName ASC, Role ASC 
;

-- display by specific volunteer role
SELECT volunteerID AS '_', Seasons.description AS 'Season', 
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
ORDER BY Adults.lastName ASC, Adults.firstName ASC, Role ASC 
;

-- insert by adultID/role is in forms page, below

-- insert by copying (prepare to update)
INSERT INTO Volunteers (role, details, adultID, teamID) 
    SELECT role, details, adultID, teamID FROM Volunteers WHERE volunteerID = :selected_voluunteer;

-- update a volunteer record: team and details
UPDATE Volunteers SET teamID = :selected_teamID,\
        details = :input_details WHERE volunteerID = :selected_volunteer;

-- delete a volunteer record
-- single role
DELETE FROM Volunteers WHERE volunteerID = :selected_volunteerID
;

-- for an adult
DELETE FROM Volunteers WHERE adultID = :selected_adultID
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

-- option: select by division
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
        WHERE Divisions.divisionID = :selected_divisionID 
        ORDER BY Divisions.description ASC, Teams.name ASC, Players.lastName ASC, Players.firstName ASC 
        ;

-- insert player is done through forms, below

-- update player
UPDATE Players SET Players.playerTeamID = :selected_teamID
WHERE playerID = :selected_playerID
;

-- remove player
DELETE FROM Players WHERE playerID = :selected_playerID
;
-- ----------------------------------------------------------------------------------
-- Teams Page - display team information by season/division, Add team, Remove team, Update team name/mascot/coach

-- Display team essentials: season, division, name, head coach, currentPlayerCount (less than/more than min/max?)
SELECT Teams.teamID, Teams.name, Teams.mascot, 
        Divisions.description as 'teamDivision', concat(Adults.firstName, 
        ' ', Adults.lastName) as 'headCoach', COUNT(Players.playerID) AS numPlayers FROM Teams 
        INNER JOIN Volunteers ON Teams.headCoachID = Volunteers.volunteerID 
        INNER JOIN Adults ON Volunteers.adultID = Adults.adultID 
        LEFT JOIN Divisions ON Teams.teamDivisionID = Divisions.divisionID 
LEFT JOIN Players ON Teams.teamID = Players.playerTeamID

ORDER BY Teams.name
;

-- search by name
SELECT Teams.teamID, Teams.name, Teams.mascot, 
        Divisions.description as 'teamDivision', concat(Adults.firstName, 
        ' ', Adults.lastName) as 'headCoach', COUNT(Players.playerID) AS numPlayers FROM Teams 
        INNER JOIN Volunteers ON Teams.headCoachID = Volunteers.volunteerID 
        INNER JOIN Adults ON Volunteers.adultID = Adults.adultID 
        LEFT JOIN Divisions ON Teams.teamDivisionID = Divisions.divisionID 
        WHERE Teams.name LIKE :input_name
        ORDER BY Teams.name;


-- add new team
INSERT INTO Teams (name, mascot, teamDivisionID, headCoachID)
VALUES (:new_name, :new_mascot, :selected_division, 
	:selected_headCoachID
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
SET mascot = :new_mascot
WHERE Teams.teamID = :selected_teamID
;

-- remove a team
-- volunteer lines for this team will automatically be removed (the volunteer will stay in a non-team and other roles, though)
DELETE FROM Teams WHERE teamID = :selected_teamID
;


-- ---------------------------------------------------------------------------------
-- Games page - display a history of games and an upcoming schedule. Add/update/remove games

-- display games
SELECT gameID, DATE_FORMAT(Games.dateTime, '%Y-%m-%d %r') as dateTime, homeScore, awayScore, \
    fieldNumber, homeTeamID, awayTeamID, refereeID FROM Games
    ORDER BY dateTime ASC;
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

-- delete a game
DELETE FROM Games WHERE gameID = :selectedGameID
;

-- ------------------------------------------------------------------------------------
-- Orders Page - display order history, order history and invoices for selected person, add an order, delete an order

-- setup for an adults selection
SELECT * FROM Adults 
    ORDER BY Adults.lastName, Adults.firstName;
    
SELECT Adults.adultID, CONCAT(Adults.firstName, ' ', Adults.lastName) as adultName FROM Adults
   ORDER BY Adults.lastName, Adults.firstName;

-- setup for a players selection
SELECT Players.playerID, Players.firstName, Players.lastName, Players.Gender,  DATE_FORMAT(Players.DOB, '%Y-%m-%d') as DOB, CONCAT(Adults.firstName, ' ', Adults.lastName) AS primaryAdultID, Teams.name AS playerTeamID FROM Players
    INNER JOIN Adults ON Players.primaryAdultID = Adults.adultID
    LEFT JOIN Teams ON Players.playerTeamID = Teams.teamID
    ORDER BY Players.lastName, Players.firstName;

SELECT Teams.teamID, Teams.name FROM Teams
    ORDER BY Teams.name;


-- display order history
SELECT Adults.firstName, Adults.lastName, Orders.orderID, Orders.orderDate, Orders.orderDetails, Orders.orderTotal
FROM Orders
INNER JOIN Adults ON Orders.registeringAdultID = Adults.adultID
INNER JOIN Forms ON Orders.orderID = Forms.orderID
ORDER BY Orders.orderDate DESC
;

-- search for existing adult
SELECT adultID FROM ADULTS
WHERE firstName = :entered_firstName AND lastName =:entered_LastName

-- add a registering adult
INSERT INTO Adults (firstName, lastName, phone, email, isGuardian, connectedAdultID)
VALUES (:first_name, :last_name, :phone, :email, :guardian, :connectedAdult)
;

-- if that adult is a volunteer
SELECT MAX(adultID) as adultID FROM Adults;
INSERT INTO Volunteers (role, details, adultID)
                        VALUES (:input_role, :input_details, :parsedID);
                        
-- add volunteer


-- add an order
INSERT INTO Orders (orderDate, orderTotal, orderDetails, registeringAdultID)
            Values (:orderDate, :orderTotal, :input_details, :selected_adultID)
;
-- add a form
SELECT MAX(orderID) as orderID FROM Orders;

INSERT INTO Forms (formDetails, orderID, seasonDivisionID, registeredPlayerID, registeredAdultID)
                                      VALUES(:input_details, :parsed_OrderID}, :parsed_FormDivsion}, :selected_playerID, :selectedVolunteerID);
                           



-- add a player
INSERT INTO Players (firstName, lastName, gender, dob, primaryAdultID)
VALUES (:player_first, :player_last, :player_gender, :player_dob, 
(:adultID
)
;

-- add a volunteer
-- prev adult, selected by reg checkbox or by search for existing adult
INSERT INTO Volunteers (adultID, role, details)
VALUES
(:selected_adultID, :role, :details)
;



-- display order history
SELECT Orders.orderID, DATE_FORMAT(Orders.orderDate, '%Y-%m-%d') \
        AS orderDate, Orders.orderTotal, Orders.orderDetails, concat(Adults.firstName, ' ', Adults.lastName) AS 'registeringAdultID' FROM Orders \
        INNER JOIN Adults ON Adults.adultID = Orders.registeringAdultID;


-- ------------------------------------------------------------------------------------
-- Form Page - display the order details for a single order, add a form to an active order

-- display the order details
SELECT Forms.formID, Forms.formDetails, Forms.orderID, \
        concat(Seasons.description, ' ', Divisions.description) as 'division', \
        concat(Players.firstName, ' ', Players.lastName) as 'player', \
        concat(Adults.firstName, ' ', Adults.lastName) as 'adult'  FROM Forms \
        INNER JOIN SeasonsDivisions ON Forms.seasonDivisionID = SeasonsDivisions.seasonDivisionID \
        INNER JOIN Seasons ON SeasonsDivisions.seasonID = Seasons.seasonID \
        INNER JOIN Divisions ON SeasonsDivisions.divisionID = Divisions.divisionID \
        LEFT JOIN Players ON Forms.registeredPlayerID = Players.playerID \
        LEFT JOIN Adults ON Forms.registeredAdultID = Adults.adultID \
        ORDER BY Forms.formID;
    
-- ------------------------------------------------------------------------------------


