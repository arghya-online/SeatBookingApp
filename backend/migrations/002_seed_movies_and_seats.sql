INSERT INTO movies (title, rating, image_url)
VALUES
  ('Inception', 8.8, 'https://i.pinimg.com/1200x/b0/ae/a4/b0aea49646879a043ad9f6ec3002e99f.jpg'),
  ('Interstellar', 8.6, 'https://i.pinimg.com/1200x/f0/0e/f4/f00ef4ef28062a3ffe32c80cfa039c86.jpg'),
  ('The Batman', 7.9, 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=500&h=750&fit=crop'),
  ('Dune', 8.0, 'https://i.pinimg.com/736x/51/26/08/512608d675fd98fca4105f90ab7d6d5c.jpg'),
  ('Dhurandhar', 7.8, 'https://i.pinimg.com/736x/b9/4c/05/b94c05a007be8988685c363be52e0b5a.jpg'),
  ('Joker', 8.4, 'https://i.pinimg.com/736x/42/bb/ba/42bbbaefd687903bc80b02c014e64a5b.jpg')
ON CONFLICT (title)
DO UPDATE SET
  rating = EXCLUDED.rating,
  image_url = EXCLUDED.image_url;

INSERT INTO movie_seats (movie_id, seat_number)
SELECT m.id, gs.seat_number
FROM movies m
CROSS JOIN generate_series(1, {{SEATS_PER_MOVIE}}) AS gs(seat_number)
ON CONFLICT (movie_id, seat_number) DO NOTHING;
