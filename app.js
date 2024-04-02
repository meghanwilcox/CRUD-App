const express = require('express');
const cors = require('cors'); // Import cors middleware
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3');
const sqlite = require('sqlite');
const fs = require('fs');
const readline = require('readline');

const app = express();

app.use(cors()); // Enable CORS

app.use(bodyParser.json());

//getDBConnection: a function to establish a connection with the database
async function getDBConnection() {
    const db = await sqlite.open({
    filename: 'data/CRUDAppDB.db',
    driver: sqlite3.Database
    });
    return db;
}

// Root endpoint
app.get('/', function(req, res) {
    res.send('Hello World!');
});

// POST endpoint to add user's favorite dog breed to the database
app.post('/create-favorite-dog-breed', async function(req, res) {
    try {
        const { fav_dog_breed } = req.body;

        // Ensure fav_dog_breed is provided
        if (!fav_dog_breed) {
            return res.status(400).json({ error: 'fav_dog_breed is required.' });
        }

        // Establish connection with the database
        const db = await getDBConnection();

        // Insert data into the database
        await db.run('INSERT INTO Favorite_Dog_Breed (fav_dog_breed) VALUES (?)', [fav_dog_breed]);

        // Query the database to get the user_id of the last inserted row
        const insertedRow = await db.get('SELECT last_insert_rowid() as user_id');

        // Extract the user_id from the inserted row
        const user_id = insertedRow.user_id;

        // Close the database connection
        await db.close();

        // Send the user_id as a response
        res.json({ user_id: user_id, message: 'Favorite dog breed added successfully.' });

        console.log("Favorite Dog Breed Added Successfully!");
    } catch (error) {
        console.error('Error adding favorite dog breed:', error);
        res.status(500).json({ error: 'An error occurred while adding favorite dog breed.' });
    }
});

// GET endpoint to fetch top 5 most occurring dog breeds
app.get('/top-dog-breeds', async function(req, res) {
    try {
        // Establish connection with the database
        const db = await getDBConnection();

        // Execute the SQL query to fetch top 5 most occurring dog breeds
        const queryResult = await db.all(`
            SELECT fav_dog_breed, COUNT(*) AS breed_count
            FROM Favorite_Dog_Breed
            GROUP BY fav_dog_breed
            ORDER BY breed_count DESC
            LIMIT 5;
        `);

        // Close the database connection
        await db.close();

        // Send the query result as JSON response
        res.json(queryResult);
    } catch (error) {
        console.error('Error fetching top dog breeds:', error);
        res.status(500).json({ error: 'An error occurred while fetching top dog breeds.' });
    }
});

// POST endpoint to edit user's favorite dog breed in the database
app.post('/edit-favorite-dog-breed/:user_id', async function(req, res) {
    try {
        const user_id = req.params.user_id;
        const { fav_dog_breed } = req.body;

        // Ensure user_id and fav_dog_breed are provided
        if (!user_id || !fav_dog_breed) {
            return res.status(400).json({ error: 'user_id and fav_dog_breed are required.' });
        }

        // Establish connection with the database
        const db = await getDBConnection();

        // Update the entry in the database
        await db.run('UPDATE Favorite_Dog_Breed SET fav_dog_breed = ? WHERE user_id = ?', [fav_dog_breed, user_id]);

        // Close the database connection
        await db.close();

        // Send a success response
        res.json({ message: 'Favorite dog breed updated successfully.' });

        console.log("Favorite Dog Breed Updated Successfully!");
    } catch (error) {
        console.error('Error updating favorite dog breed:', error);
        res.status(500).json({ error: 'An error occurred while updating favorite dog breed.' });
    }
});

// DELETE endpoint to delete a favorite dog breed entry by user ID
app.delete('/delete-favorite-dog-breed/:user_id', async function(req, res) {
    try {
        const { user_id } = req.params;

        // Ensure user_id is provided
        if (!user_id) {
            return res.status(400).json({ error: 'User ID is required.' });
        }

        // Establish connection with the database
        const db = await getDBConnection();

        // Delete the entry from the database using user_id
        await db.run('DELETE FROM Favorite_Dog_Breed WHERE user_id = ?', [user_id]);

        // Close the database connection
        await db.close();

        // Send a success response
        res.json({ message: 'Favorite dog breed entry deleted successfully.' });
    } catch (error) {
        console.error('Error deleting favorite dog breed entry:', error);
        res.status(500).json({ error: 'An error occurred while deleting favorite dog breed entry.' });
    }
});

// Start the server
app.listen(3000, function() {
    console.log('Dog Breed Server listening on port 3000!');
});