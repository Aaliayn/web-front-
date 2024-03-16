let isLoggedIn = false;
let currentUsername = '';

document.addEventListener('DOMContentLoaded', async function () {
    // const rememberMeCheckbox = document.getElementById('rememberMe');
    // const usernameInput = document.getElementById('username');
    // const passwordInput = document.getElementById('password');


    if (localStorage.getItem('user')) {
        const userDetails = JSON.parse(localStorage.getItem('user'));

        if (userDetails.token) {
            currentUsername = userDetails.username;
            document.getElementById('buttons').style.display = 'flex';
            const movieData = await fetchMovies();
            console.log(movieData);
            displayContent(movieData, 'movie');
            if (userDetails.username === 'aaliyan') {
                document.getElementById('addNewUserButton').style.display = 'flex';
            }
            isLoggedIn = true;
        }
    }
    else {
        window.location.href = `index.html`
    }
})

// Function to add a new user

function addNewUser() {
    console.log(currentUsername);
    if (currentUsername) {
        window.location.href = `addUser.html`
    }
    else {
        alert('You do not have permission to add new users.');
    }
}
// Function to create a new user
function createUser(username, password) {
    // Implement logic to create a new user with the given username and password
    alert(`User created successfully!\nUsername: ${username}`);
}

async function browseOptions(option) {
    switch (option.toLowerCase()) {
        case 'bollywood':
            window.location.href = 'https://desicinemas.tv/';
            break;
        case 'movies':
            // Fetch and display movies
            const movieData = await fetchMovies();
            displayContent(movieData, 'movie');
            break;
        case 'tv shows':
            // Fetch and display TV shows
            const tvShowData = await fetchTVShows();
            displayContent(tvShowData, 'tv');
            break;
        default:
            alert('Invalid choice');
    }
}

async function browse() {
    const options = ['Bollywood', 'Movies', 'TV Shows'];
    const buttonsHTML = options.map(option => `<button onclick="browseOptions('${option}')">${option}</button>`).join('');
    document.getElementById('mainContent').innerHTML = `<h2>Choose an option:</h2>${buttonsHTML}`;
}

async function search() {
    const searchContainer = document.createElement('div');
    searchContainer.innerHTML = `
        <label for="searchQuery">Enter your search query:</label>
        <input type="text" id="searchQuery" placeholder="Search...">
        <button onclick="performSearch()">Search</button>
    `;

    document.getElementById('mainContent').innerHTML = '';
    document.getElementById('mainContent').appendChild(searchContainer);
}

async function performSearch() {
    const searchQuery = document.getElementById('searchQuery').value;
    if (searchQuery) {
        const apiKey = '11543838fce02f393c7aab50001e3a07';

        // Fetch data based on the search query
        const response = await fetch(`https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&query=${searchQuery}`);
        const data = await response.json();

        // Display search results with movie names
        const results = data.results.map(item => `<div onclick="showDetails('${item.id}', '${item.title || item.name}')">
        <img src="https://image.tmdb.org/t/p/w200${item.poster_path}" alt="${item.title || item.name}"><br>${item.title || item.name}</div>`);

        document.getElementById('mainContent').innerHTML = `<h2>Search Results</h2>${results.length > 0 ? results.join('') : 'No Results Found'}`;
    }
}

function showDetails(id, title, type) {
    if (id && type) {
        window.location.href = `movieDetails.html?id=${id}&type=${type}&user=${currentUsername}`;
    } else {
        alert('Error: Missing ID or Type parameters.');
    }
}

async function fetchMovies() {
    const apiKey = '11543838fce02f393c7aab50001e3a07';

    // Replace the following with your actual API endpoint for movies
    const response = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}`);
    const data = await response.json();
    return data.results;
}

async function fetchTVShows() {
    const apiKey = '11543838fce02f393c7aab50001e3a07';

    // Replace the following with your actual API endpoint for TV shows
    const response = await fetch(`https://api.themoviedb.org/3/tv/popular?api_key=${apiKey}`);
    const data = await response.json();
    console.log(data.results);
    return data.results;
}

function displayContent(data, type) {
    const contentHTML = data.map(item => `<div onclick="showDetails('${item.id}', '${item.title || item.name}', '${type}')">
    <img src="https://image.tmdb.org/t/p/w200${item.poster_path}" alt="${item.title || item.name}">
   
    <br>${item.title || item.name}</div>`).join('');
    document.getElementById('mainContent').innerHTML = contentHTML;

    document.getElementById('catTitle').style.display = 'flex';
    if (type === 'movie') {
        document.getElementById('tvShowsCategories').style.display = 'none';
        document.getElementById('moviesCategories').style.display = 'flex';
    }
    else {
        document.getElementById('moviesCategories').style.display = 'none';
        document.getElementById('tvShowsCategories').style.display = 'flex';
    }
}

{/* <div>
<button onclick="openPlayer('${item.id}', '${type}', '${'server1'}')">Watch Server1</button>
<button onclick="openPlayer('${item.id}', '${type}', '${'server2'}')">Watch Server2</button>
</div>
<button onclick="showDetails('${item.id}', '${item.title || item.name}', '${type}')">Show Details</button> */}

function authenticate(username, password) {

    return username === 'admin' && password === 'admin';
}

// Function to fetch TV show details (seasons and episodes)
async function showTVShowDetails(tvShowId) {
    const apiKey = '11543838fce02f393c7aab50001e3a07';

    // Fetch TV show details
    const response = await fetch(`https://api.themoviedb.org/3/tv/${tvShowId}?api_key=${apiKey}`);
    const data = await response.json();

    // Display TV show details
    const seasons = data.seasons.map(season => `<button onclick="selectSeason('${tvShowId}', ${season.season_number})">Season ${season.season_number}</button>`).join('');
    document.getElementById('mainContent').innerHTML = `<h2>Select a Season for ${data.name}</h2>${seasons}`;
}

// Function to select a season for the TV show
async function selectSeason(tvShowId, seasonNumber) {
    const apiKey = '11543838fce02f393c7aab50001e3a07';

    // Fetch episodes for the selected season
    const response = await fetch(`https://api.themoviedb.org/3/tv/${tvShowId}/season/${seasonNumber}?api_key=${apiKey}`);
    const data = await response.json();

    // Display episodes for the selected season
    const episodes = data.episodes.map(episode => `<button onclick="selectEpisode('${tvShowId}', ${seasonNumber}, ${episode.episode_number})">Episode ${episode.episode_number}</button>`).join('');
    document.getElementById('mainContent').innerHTML = `<h2>Select an Episode for Season ${seasonNumber}</h2>${episodes}`;
}

// Function to select an episode for the TV show
async function selectEpisode(tvShowId, seasonNumber, episodeNumber) {
    // Save the selected TV show, season, and episode to user's watch history
    saveToHistory(tvShowId, currentUsername, seasonNumber, episodeNumber);

    // Display a confirmation message
    document.getElementById('mainContent').innerHTML = `<h2>Watch history updated for ${currentUsername}</h2>`;
}

// Function to save user's watch history
function saveToHistory(tvShowId, username, seasonNumber, episodeNumber) {
    const userHistory = getUserHistory(username);
    userHistory.push({
        title: tvShowId, // You might want to fetch the TV show title from the API
        season: seasonNumber,
        episode: episodeNumber
    });

    // Save the updated history to localStorage
    localStorage.setItem(username, JSON.stringify(userHistory));
}

// Function to get user's watch history from localStorage
function getUserHistory(username) {
    const userHistory = localStorage.getItem(username);
    return userHistory ? JSON.parse(userHistory) : [];
}

// Your existing code...

// async function login() {
//     const username = document.getElementById('username').value;
//     const password = document.getElementById('password').value;
//     const rememberMeCheckbox = document.getElementById('rememberMe');

//     const data = {
//         username: username,
//         password: password
//     }

//     try {
//         const res = await fetch('http://localhost:5000/api/user/login', {
//             method: 'POST',
//             headers: {
//                 "Content-Type": "application/json"
//             },
//             body: JSON.stringify(data)
//         })
//         const user = await res.json();

//         if (user) {
//             const userData = parseJwt(user.token);
            
//             if (userData.user.username === 'aaliyan') {
//                 document.getElementById('addNewUserButton').style.display = 'flex';
//             }
//             isLoggedIn = true;
//             currentUsername = userData.user.username;
            
//             localStorage.setItem('user', JSON.stringify({ username: userData.user.username, token: user.token }));
//             document.getElementById('loginForm').style.display = 'none';
//             document.getElementById('buttons').style.display = 'flex';
//             const movieData = await fetchMovies();
//             displayContent(movieData, 'movie');
//         }
//     } catch (error) {
//         console.log('error', error.message);
//     }
// }

function logout() {
    if (localStorage.getItem('user')) {
        localStorage.removeItem('user');
    }
    location.reload();
}

function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

function showHistory() {
    // Implement logic to show user's watch history
    alert('Displaying watch history...');
}

// Add the following functions for user management and TV show season/episode selection

function addUser() {
    // Implement logic to add a new user with username and password
    alert('Adding a new user...');
}

function changeUserCredentials() {
    // Implement logic to change username or password for a user
    alert('Changing user credentials...');
}

async function selectTVShowSeasonEpisode(tvShowId) {
    // Implement logic to fetch TV show details, including seasons and episodes
    const apiKey = '11543838fce02f393c7aab50001e3a07';
    const response = await fetch(`https://api.themoviedb.org/3/tv/${tvShowId}?api_key=${apiKey}`);
    const data = await response.json();

    // Display TV show details and allow users to select season and episode
    alert(`TV Show: ${data.name}\nSeasons: ${data.seasons.length}\nEpisodes: ${data.number_of_episodes}`);
    // Add logic to save the selected TV show, season, and episode in history
}
