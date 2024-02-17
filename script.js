// YouTube API key and base URL
const API_KEY = "AIzaSyAApTsqFshhvrPI_fTMTBOREKNuit_64Y4";
const BASE_URL = "https://www.googleapis.com/youtube/v3";

// Function to fetch video data based on a search query and maximum items
// Modify the fetchData function in script.js
async function fetchData(searchQuery, maxItems) {
  try {
    showLoader(); // Show loader before fetching data

    let response = await fetch(`${BASE_URL}/search?key=${API_KEY}&q=${searchQuery}&maxResults=${maxItems}&part=snippet`);
    let data = await response.json();
    let arr = data.items;
    displayCards(arr, scrollableRightSections);
  } catch (error) {
    console.error('Error fetching data:', error);
  } finally {
    hideLoader(); // Hide loader after fetching data
  }
}


// Event listener to fetch data when the page loads
window.addEventListener('load', () => {
  fetchData("", 53);
});

// Event listener for the search button
searchDiv.addEventListener("click", () => {
  let Value = searchInput.value;
  fetchData(Value, 53);
  searchInput.value = "";
});

// Add an event listener for "keyup" on the search input
searchInput.addEventListener("keyup", (event) => {
  if (event.keyCode === 13) {
    // Check if Enter key is pressed (keyCode 13)
    let value = searchInput.value;
    fetchData(value, 12);

    // Clear the input after searching if needed
    // searchInput.value = "";
  }
});

// Initialize speech recognition
const recognition = new webkitSpeechRecognition() || new SpeechRecognition();

// Add an event listener for the start event when speech recognition starts
recognition.addEventListener('start', () => {
  // Update the search input placeholder text to indicate listening
  searchInput.placeholder = 'Listening...';
});

// Add an event listener for the end event when speech recognition ends
recognition.addEventListener('end', () => {
  // Reset the search input placeholder text when speech recognition ends
  searchInput.placeholder = 'Search';
});

// Add an event listener for the result event when speech recognition is successful
recognition.addEventListener('result', (event) => {
  // Get the recognized text from the result
  const speechResult = event.results[0][0].transcript;

  // Set the search input value to the recognized text
  searchInput.value = speechResult;

  // Trigger the fetchData function with the recognized text
  fetchData(speechResult, 12);
});

// Add an event listener for the end event when speech recognition ends
recognition.addEventListener('end', () => {
  // Reset the search input placeholder text when speech recognition ends
  searchInput.placeholder = 'Search';
});

// Add an event listener for the error event if there is an issue with speech recognition
recognition.addEventListener('error', (event) => {
  console.error('Speech recognition error:', event.error);
  // Reset the search input placeholder text on error
  searchInput.placeholder = 'Search';
});

// Add an event listener for the mic div to initiate speech recognition
document.querySelector('.mic').addEventListener('click', () => {
  recognition.start();
});

// Function to get video information based on video ID
async function getVideoInfo(videoId) {
  let response = await fetch(`${BASE_URL}/videos?key=${API_KEY}&part=statistics&id=${videoId}`);
  let data = await response.json();
  return data.items;
}

// Function to get channel logo based on channel ID
async function getChannelLogo(channelId) {
  const response = await fetch(`${BASE_URL}/channels?key=${API_KEY}&part=snippet&id=${channelId}`);
  const data = await response.json();
  return data.items;
}

// Function to get subscription information based on channel ID
async function getSubscription(channelid) {
  let response = await fetch(`${BASE_URL}/channels?key=${API_KEY}&id=${channelid}&part=statistics`);
  let data = await response.json();
  return data.items;
}

// Function to display video cards on the page
async function displayCards(data, displayBody) {
  displayBody.innerHTML = "";
  for (const ele of data) {
    let viewCountObj = await getVideoInfo(ele.id.videoId);
    ele.viewObject = viewCountObj;
    let channelInfoObject = await getChannelLogo(ele.snippet.channelId);
    ele.channelObject = channelInfoObject;
    let subscribers = await getSubscription(ele.snippet.channelId);
    ele.subscriberCount = subscribers;
    let displayDuration = calDuration(ele.snippet.publishedAt);
    let videoCard = document.createElement("a");
    videoCard.className = "videoCard";
    videoCard.href = `./selectedVideo.html?videoId=${ele.id.videoId}`;

    // Event listener to store selected video information in session storage
    videoCard.addEventListener("click", () => {
      const InfoSelectedVideo = {
        videoTitle: `${ele.snippet.title}`,
        channelLogo: `${ele.channelObject[0].snippet.thumbnails.high.url}`,
        channelName: `${ele.snippet.channelTitle}`,
        likeCount: `${ele.viewObject[0].statistics.viewCount}`,
        channelID: `${ele.snippet.channelId}`,
        subscribers: `${ele.subscriberCount[0].statistics.subscriberCount}`,
      };
      sessionStorage.setItem("selectedVideoInformation", JSON.stringify(InfoSelectedVideo));
    });

    videoCard.innerHTML = `<img src="${ele.snippet.thumbnails.high.url}">
        <div class="channel">
            <img src="${ele.channelObject[0].snippet.thumbnails.high.url}" >
            <h4>${ele.snippet.title}</h4>
        </div>
        <div class="channelInfo">
            <p>${ele.snippet.channelTitle}</p>
            <p> ${calculateViews(
      ele.viewObject[0].statistics.viewCount
    )} views , ${displayDuration} ago </p>
        </div>`;

    displayBody.appendChild(videoCard);
  }
}

// Function to calculate the duration since a video was published
function calDuration(publisedDate) {
  // Implementation for calculating duration...
  let displayTime;
  let publisedAt = new Date(publisedDate);
  let MiliSecFromPublised = publisedAt.getTime();
  let currentTime = new Date();
  let currentTimeInMiliSec = currentTime.getTime();
  let duration = currentTimeInMiliSec - MiliSecFromPublised;
  let days = parseInt(duration / 86400000);
  if (days < 1) {

    let hours = parseInt(duration / 3600000);
    displayTime = hours + " " + "hours";
  } else if (days > 6 && days <= 29) {
    let weeks = parseInt(days / 7);
    displayTime = weeks + " " + "weeks";
  } else if (days > 29 && days <= 364) {
    let months = parseInt(days / 30);
    displayTime = months + " " + "months";
  } else if (days > 364) {
    let years = parseInt(days / 365);
    displayTime = years + " " + "years";
  } else {
    displayTime = days + " " + "days";
  }

  return displayTime;
}

// Function to format views count
function calculateViews(viewCount) {
  // Implementation for formatting views count...
  let displayViews;
  let count;
  if (viewCount < 1000) {
    displayViews = viewCount;
  } else if (viewCount >= 1000 && viewCount <= 999999) {
    displayViews = (viewCount / 1000).toFixed(1) + " " + "K";
  } else if (viewCount >= 1000000) {
    displayViews = (viewCount / 1000000).toFixed(1) + " " + "M";
  }
  return displayViews;
}

// Event listener for the menu button to toggle small menu options
let menuButton = document.getElementById("menubar");
menuButton.addEventListener('click', showSmallMenuOptions);

function showSmallMenuOptions() {
  let menuCards = document.getElementsByClassName("mo");
  for (let menu of menuCards) {
    if (menu.classList.contains("menuCards")) {
      menu.classList.remove("menuCards");
      menu.classList.add("MENUCARDS");
      leftSection.style.flex = 1.5;
      copyRightSystem.style.display = "block";
    } else {
      menu.classList.remove("MENUCARDS");
      menu.classList.add("menuCards");
      leftSection.style.flex = 0.5;
      copyRightSystem.style.display = "none";
    }
  }
}


// Function to toggle visibility of loader
function toggleLoader(showLoader) {
  let loader = document.getElementById("loader");
  if (showLoader) {
    loader.style.display = "block";
  } else {
    loader.style.display = "none";
  }
}

// Function to fetch data (example with loader)
async function fetchData(searchQuery, maxItems) {
  try {
    // Show loader while fetching data
    toggleLoader(true);

    let response = await fetch(`${BASE_URL}/search?key=${API_KEY}&q=${searchQuery}&maxResults=${maxItems}&part=snippet`);
    let data = await response.json();
    let arr = data.items;

    // Hide loader after data is fetched
    toggleLoader(false);

    displayCards(arr, scrollableRightSections);
  } catch (error) {
    // Handle errors and hide loader
    console.error(error);
    toggleLoader(false);
  }
}

// Add these functions at the beginning of script.js
function showLoader() {
  const loader = document.getElementById('loader');
  loader.style.display = 'block';
}

function hideLoader() {
  const loader = document.getElementById('loader');
  loader.style.display = 'none';
}


// const showMoreButton = document.getElementById('showMoreButton');
// const hiddenOptionsContainer = document.getElementById('hiddenOptionsContainer');
// showMoreButton.addEventListener('click', () => {
//   if(hiddenOptionsContainer.style.display === 'none' || hiddenOptionsContainer.style.display === '') {
//     hiddenOptionsContainer.style.display = 'block';
//     showMoreButton.innerText = "Show less";
//   } else {
//     hiddenOptionsContainer.style.display = 'none';
//     showMoreButton.textContent = 'Show More';
//   }
// });

// Get the theme toggle checkbox element
let themeToggleCheckbox = document.getElementById('theme-toggle-checkbox');

// Add event listener to toggle the theme
themeToggleCheckbox.addEventListener('change', function() {
  if (this.checked) {
    // Switch to dark theme
    document.body.classList.add('dark-theme');
  } else {
    // Switch to light theme
    document.body.classList.remove('dark-theme');
  }
});
