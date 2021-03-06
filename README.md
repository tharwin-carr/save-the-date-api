<h1>Save The Date Express API</h1>

<p>This is an express api for my Save The Date app. There are two endpoints dates and favorites.</p>
<p>Both endpoints follow CRUD: In the project Dates utilizes GET and POST - an example of both is provided Favorites utilizes GET, POST and DELETE - 
an example of each is provided</p>

<h2>Dates</h2>
<h3>Get all dates</h3>

<ul>
    <li>URL: /api/dates</li>
    <li>Method: GET</li>
    <li>URL Params: None</li>
    <li> DATA Params: None</li>
    <li>Success Response: Code: 200 Content: {id: 1, content: 'Go to the highest point in the city or town and watch the sunset' }
    <li>Error Response: Code: 404 NOT FOUND Content: error: { message: Date not found }
</ul>

<h3>Post date</h3>

<ul>
    <li>URL: /api/dates</li>
    <li>Mehtod: POST</li>
    <li>URL Params: None</li>
    <li>DATA Params: {content}</li>
    <li>Success Response: Code 200 Content: {id: 2, content: 'Go to a park you have never been to before and have a picnic'}
    <li>Error Response: Code 404 Content: error: { message: 'missing content in request body'}
</ul>

<h2>Favorites</h2>
<h3>Get all favorites</h3>

<ul>
    <li>URL: /api/favorites</li>
    <li>Method: GET</li>
    <li>URL Params: None</li>
    <li> DATA Params: None</li>
    <li>Success Response: Code: 200 Content: {favorite_id: 1}
    <li>Error Response: Code: 404 NOT FOUND Content: error: { message: Favorite not found }
</ul>

<h3>Post favorite</h3>

<ul>
    <li>URL: /api/favorites</li>
    <li>Mehtod: POST</li>
    <li>URL Params: None</li>
    <li>DATA Params: {content}</li>
    <li>Success Response: Code 200 Content: {favorite_id: 2}
    <li>Error Response: Code 404 Content: error: { message: 'missing content in request body'}
</ul>

<h3>Delete favorite</h3>

<ul>
    <li>URL: /api/favorite</li>
    <li>Mehtod: DELETE</li>
    <li>URL Params: None</li>
    <li>DATA Params: None</li>
    <li>Success Response: Code 200 Content: {id: 2}
    <li>Error Response: Code 404 Content: error: { message: 'Favorite doesn't exist'}
</ul>

<a href='https://save-the-date-wheat.vercel.app/'>Live version of app</a>
<a href='https://github.com/tharwin-carr/save_the_date'>Client Repo</a>

<p>Tech used: Express, Node, Postgresql, Knex, Chai</p>