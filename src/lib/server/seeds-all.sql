INSERT INTO
  ships (name, size, color)
VALUES
  ('aircraftCarrier', 5, 'orange');
INSERT INTO
  ships (name, size, color)
VALUES
  ('battleship', 4, 'red');
INSERT INTO
  ships (name, size, color)
VALUES
  ('cruiser', 3, 'grey');
INSERT INTO
  ships (name, size, color)
VALUES
  ('submarine', 3, 'green');
INSERT INTO
  ships (name, size, color)
VALUES
  ('destroyer', 2, 'purple');

INSERT INTO
players (name)
VALUES ('Jabami');
INSERT INTO
players (name)
VALUES ('Kuroko');

INSERT INTO matches (player1_id, player2_id)
VALUES (1, 2);

INSERT INTO
  enemy_ship_placements (ship_name, row, col, direction, player_id, match_id)
VALUES
  ('aircraftCarrier', 3, 2, 'horizontal', 2, 1);
INSERT INTO
  enemy_ship_placements (ship_name, row, col, direction, player_id, match_id)
VALUES
  ('battleship', 1, 5, 'horizontal', 2, 1);
INSERT INTO
  enemy_ship_placements (ship_name, row, col, direction, player_id, match_id)
VALUES
  ('cruiser', 4, 6, 'horizontal', 2, 1);
INSERT INTO
  enemy_ship_placements (ship_name, row, col, direction, player_id, match_id)
VALUES
  ('submarine', 7, 7, 'horizontal', 2, 1);
INSERT INTO
  enemy_ship_placements (ship_name, row, col, direction, player_id, match_id)
VALUES
  ('destroyer', 3, 8, 'horizontal', 2, 1);