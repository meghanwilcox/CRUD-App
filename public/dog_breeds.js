document.addEventListener('DOMContentLoaded', () => {
    //retrive data from the input forms
    const addDogBreedForm = document.getElementById('new-data-form');
    const dogBreedInput = document.getElementById('dogBreedsSelect');
    const submitButton = document.getElementById('submit-button');
    const dogBreedsDiv = document.getElementById('display-data-container');
    const buttonsContainer = document.getElementById('buttons-container');
    const updateDataForm = document.getElementById('update-data-form');
    const dogBreedInputUpdate = document.getElementById('dogBreedsSelect-update');
    const deleteButton = document.getElementById('delete-btn');

    let user_id;

    // Add event listener to the form submission
    addDogBreedForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent default form submission
        
        // Hide the submit button
        submitButton.style.display = 'none';
        buttonsContainer.style.display = 'flex';
        // Formulate the JSON object
        const userData = {
            fav_dog_breed: dogBreedInput.value
        };

        try {
            // Send POST request to the create a favorite dog breed endpoint
            const response = await fetch('http://localhost:3000/create-favorite-dog-breed', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            // Parse the JSON response
            const responseData = await response.json();

            // Extract user_id from the response
            user_id = responseData.user_id;

            // Now you can use the user_id variable as needed
            //console.log('User ID:', user_id);

            //send a GET request to the top dog breeds endpoint to retreive the current top 5 favorite dog breeds
            const response2 = await fetch('http://localhost:3000/top-dog-breeds', {
                method: 'GET',
            });

            // Parse the JSON response
            const data = await response2.json();

            // Clear any existing content in the div
            dogBreedsDiv.innerHTML = '';

            // Add a title
            const title = document.createElement('h2');
            title.textContent = 'Current Top 5 Favorite Dog Breeds';
            dogBreedsDiv.appendChild(title);

            // Initialize an empty string to store the HTML content
            let htmlContent = '';

            // Initialize the counter
            let x = 1;

            // Iterate over the data and construct the HTML content
            data.forEach(breed => {
                // Append the HTML for each breed to the htmlContent string
                htmlContent += `<div>${x}. ${breed.fav_dog_breed}: ${breed.breed_count}</div>`;
                
                // Increment the counter
                x++;
            });

            // Set the innerHTML of the dogBreedsDiv to the constructed HTML content
            dogBreedsDiv.innerHTML += htmlContent;

            if (response.ok) {
                alert('Favorite Dog Breed added successfully!');
            } else {
                const errorMessage = await response.text();
                alert(`Failed to add favorite dog breed: ${errorMessage}`);
            }
        } catch (error) {
            console.error('Error adding new favorite dog breed:', error);
            alert('An error occurred while adding new favorite dog breed. Please try again later.');
        }
    });

    // Add event listener to the form submission for editing
    updateDataForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent default form submission
        
        // Formulate the JSON object
        const updatedData = {
            fav_dog_breed: dogBreedInputUpdate.value
        };

        try {
            // Send POST request to the edit favorite dog breed endpoint
            const response = await fetch(`http://localhost:3000/edit-favorite-dog-breed/${user_id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedData)
            });

            // Check if the request was successful
            if (response.ok) {
                alert('Favorite Dog Breed updated successfully!');
            } else {
                // Display error message if request failed
                const errorMessage = await response.text();
                alert(`Failed to update favorite dog breed: ${errorMessage}`);
            }
        } catch (error) {
            console.error('Error updating favorite dog breed:', error);
            alert('An error occurred while updating favorite dog breed. Please try again later.');
        }
    });

    deleteButton.addEventListener('click', async () => {
        try{
            const response3 = await fetch(`http://localhost:3000/delete-favorite-dog-breed/${user_id}`, {
                method: 'DELETE'
            });

            if(response3.ok){
                alert('Favorite dog breed entry deleted successfully!');
            } else {
                //if there was an error display and error message
                const errorMsg = await response3.text();
                alert('Failed to delete favorite dog bree dnetry: ${errorMsg}');
            }
        } catch(error) {
            console.error('Error deleting favorite dog breed entry:' , error);
            alert('An error occured while deleting favorite dog breed entry. Please try again later.');
        }
    });

    
});

