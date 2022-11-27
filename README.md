# 61040-final-project-gqhc

# Testing the site locally

Same as Fritter Frontend:

- run "npm run serve" on one terminal window (starting the frontend).
- run "npm run dev" on another terminal window (starting the backend).
- go to [localhost:8080](localhost:8080) to test/look around.

## NOTE:

I set up the basic structure of our repo. You are basically free to do anything inside of each folder corresponding to your assigned concepts. Just **please** have documentations that other members can read to know what your code does. Let's remind ourselves the concept of abstraction from 6.031 (no need for the users to know about actual implementations as long as preconditions/postconditions are given! Sorry to make you think about 031 again oof).

Also whenever you edited files outside of your designated concept folder and are about to push, if possible, let's ask each other if they have edited the same file(s) too! (or if you are a git god, please teach me your ways in resolving git merge conflicts! ;-;)

But thank you!

-CY

## API Routes

#### `POST /api/users/session` - Sign in user

**Body**

- `username` (string) - The user's username
- `password` (string) - The user's password

**Returns**

- A success message
- An object with user's details (without password)

**Throws**

- `403` if the user is already logged in
- `400` if username or password is not in correct format format or missing in the req
- `401` if the user login credentials are invalid

#### `DELETE /api/users/session` - Sign out user

**Returns**

- A success message

**Throws**

- `403` if user is not logged in

### `POST /api/users` - Create a new user account

**Body**

- `username`(string) - The user's username
- `password` (string) - The user's password

**Returns**

- A success message
- An object with the created user's details (without password)

**Throws**

- `403` if there is a user already logged in
- `400` if username or password is in the wrong format
- `409` if username is already in use

#### `PUT /api/users` - Update user

**Body** (Only need to add fields that are being used)

- `username`(string) - The user's username
- `password`(string) - The user's password
- `coins` (string) - The user's number of musicCoins
- `profileCosmetic` (string) - The user's profile cosmetic
- `bannerCosmetic` (string) - The user's banner cosmetic
- `backgroundCosmetic` (string) - The user's background cosmetic

**Returns**

- A success message
- An object with the update user details (without password)

**Throws**

- `403` if the user is not logged in
- `400` if any field is in the wrong format
- `409` if the username is already in use

#### `DELETE /api/users` - Delete user

**Returns**

- A success message

**Throws**

- `403` if the user is not logged in



# Rating

#### 'POST /api/rating/:contentId' - Create a rating for content

**Body**

- `rating` Rating Json mapping rating category to integer in [0, 100]

**Returns**

- `200` Success message

**Throws**

- `403` User is not logged in
- `404` Content does not exist


#### 'GET /api/rating/:contentId' - Get net rating for content

**Returns**

- `200` Success message
- `rating` Rating Json mapping rating category to integer in [0, 100].
This represents the content's rating in each category

**Throws**

- `403` User is not logged in
- `404` Content does not exist

#### 'DELETE /api/rating/:contentId' - Delete user's rating on content

**Returns**

- `200` Success message

**Throws**

- `403` User is not logged in
- `404` Content does not exist
- `404` User has not rated content
