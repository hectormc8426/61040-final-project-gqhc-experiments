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

# User

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

### 'POST /api/rating/:contentId?:category' - Create a rating for content

**Body**

- `score`(int) - The user's score of content's category

**Returns**

- `201` Successful creation message

**Throws**

- `400` Score not in range [0, 100]
- `400` Category not valid
- `403` User is not logged in
- `404` Content does not exist
- `409` User has already rated content

### 'PATCH /api/rating/:contentId?:category' - Change rating for content

**Body**

- `score`(int) - The user's score of content's category

**Returns**

- `200` Success message

**Throws**

- `400` Score not in range [0, 100]
- `400` Category not valid
- `403` User is not logged in
- `404` Content does not exist
- `409` User has not rated content

### 'GET /api/rating/:contentId' - Get net rating score for each category on content

**Returns**

- `200` Success message
- `ratings` A JSON<string, number> mapping category to content's net score in that category

**Throws**

- `404` Content does not exist

### 'GET /api/rating/:contentId?:category' - Get rating score for category

**Returns**

- `200` Success message
- `ratings` Object mapping category to net score

**throws**

- `400` Invalid category
- `404` Content does not exist

### 'GET /api/rating/:contentId?:useUserId' - Get specific rating

**Returns**

- `200` Success message
- `ratings` A JSON<string, number> mapping category to score user gave. If no rating on category, category DNE as key.

**throws**

- `400` Invalid category
- `404` Content does not exist

### 'DELETE /api/rating/:contentId' - Delete _all_ user's rating on content

**Returns**

- `200` Success message

**Throws**

- `403` User is not logged in
- `404` Content does not exist
- `404` User has not rated content

### 'DELETE /api/rating/:contentId?:category' - Delete user's rating on content's category

**Returns**

- `200` Success message

**Throws**

- `400` Invalid category
- `403` User is not logged in
- `404` Content does not exist
- `404` User has not rated content



# Tags

### 'POST /api/tags/:contentId' - Add a tag to content

**Body**

- `tagname` - name of the tag

**Returns**

- `201` Successful creation message

**Throws**

- `403` User is not logged in
- `403` User does not own this content
- `404` Content does not exist
- `409` This tag already exists for this content

### 'GET /api/tags/:contentId' - Get all tags associated with content

**Returns**

- `200` Succesful retrieval message
- List of strings denoting tags on content

**Throws**

- `404` Content does not exist

### 'DELETE /api/tags/:contentId' - Remove a tag from content

**Body**

- `tagname` - name of the tag

**Returns**

- `200` Successful tag deletion

**Throws**

- `403` User is not logged in
- `403` User does not own this content
- `404` Content does not exist
- `409` This tag des not exist for this content

# Showcase

### `GET /api/showcases` - Get all showcases

**Returns**

- An array of all showcases in the database

### `GET /api/showcases?lessonId=id` - Get all showcases with lesson Id

**Returns**

- An array of showcases associated with the given lesson Id

**Throws**

- `400` if `id` not given
- `404` if `id` is not associated with any recognized lesson

### `GET /api/showcases?userId=id` - Get all showcases by user

**Returns**

- An array of showcases created by the user with the given user Id

**Throws**

- `400` if `id` not given
- `404` if `id` is not associated with any recognized user

### `POST /api/showcases` - Make a new showcase

**Body**

- `lessonId` {string} - Id of the lesson to associate with the showcase
- `content` {string} - content of the showcase

**Returns**

- A success message
- A object with the created showcase

**Throws**

- `403` if the user is not logged in
- `400` If the showcase content is empty or a stream of empty spaces
- `404` if the lesson Id is not associated with a lesson

### `DELETE /api/showcases/:showcaseId` - Delete a showcase

**Returns**

- A success message

**Throws**

- `403` if the user is not logged in
- `403` if the user is not the author of the showcase
- `404` if the showcaseId is invalid

### `PUT /api/showcases/:showcaseId` - Modify a showcase

**Body**

- `content` *{string}* - The new content of the showcase

**Returns**

- A success message
- An object with the updated showcase

**Throws**

- `403` if the user is not logged in
- `404` if the showcaseId is invalid
- `403` if the user is not the author of the showcase
- `400` if the new showcase content is empty or a stream of empty spaces
