// Get videoId from the URL parameters
let urlParam = new URLSearchParams(window.location.search);
let videoID = urlParam.get("videoId");

// Get the main video container element
let VideoContainer = document.getElementById("mainVideo");

// Event listener to create a new YouTube player when the page loads
window.addEventListener("load", () => {
  if (YT) {
    new YT.Player(VideoContainer, {
      height: "400",
      width: "100%",
      videoId: videoID,
    });
  }
});

// Variable to store selected video information from sessionStorage
let getSelectedVideoInfo;
const videoInfoString = sessionStorage.getItem("selectedVideoInformation");
if (videoInfoString) {
  getSelectedVideoInfo = JSON.parse(videoInfoString);
}

// Function to format likes count
function calculateLikes(likeCount) {
  let displayViews;
  let count;
  if (likeCount < 1000) {
    displayViews = likeCount;
  } else if (likeCount >= 1000 && likeCount <= 999999) {
    displayViews = (likeCount / 1000).toFixed(1) + " " + "K";
  } else if (likeCount >= 1000000) {
    displayViews = (likeCount / 1000000).toFixed(1) + " " + "M";
  }
  return displayViews;
}
// Calculate likes count and subscribers count
let correctLikeCount = calculateLikes(getSelectedVideoInfo.likeCount);
let correctSubscriberCount = calculateLikes(getSelectedVideoInfo.subscribers);

// Display selected video information in the main video info section
let selectedVideoInfo = document.getElementById("mainVideoInfo");
selectedVideoInfo.innerHTML = `
<h3>${getSelectedVideoInfo.videoTitle}</h3>
<div class="videoInfo">
  <div class="channel">
    <img src="${getSelectedVideoInfo.channelLogo}" />
    <div>
      <h4>${getSelectedVideoInfo.channelName}</h4>
      <p>${correctSubscriberCount} subscribers</p>
    </div>
    <button class="subscribe">Subscribe</button>
  </div>
  <div  class="channel">
    <button class="likeButton">
      <i class="fa-regular fa-thumbs-up" style="color: #080808;"></i>
      <pre>${correctLikeCount}</pre>
      <div class="horizontalLine"></div>
      <i class="fa-regular fa-thumbs-down" style="color: #080808;"></i>
    </button>
    <button class="likeButton">
      <i class="fa-regular fa-share-from-square" style="color: #0a0a0a;"></i>
      Share
    </button>
    <button class="likeButton">
      <i class="fa-solid fa-ellipsis" style="color: #0c0d0d;"></i>
    </button>
  </div>
</div>`;

// Function to fetch comments for the specific video
async function getComments(specificvideoID) {
  try {
    let response = await fetch(`${BASE_URL}/commentThreads?key=${API_KEY}&videoId=${specificvideoID}&maxResults=20&part=snippet`)
    const data = await response.json();
    let commentsArr = data.items;
    // Call a function to display the fetched comments
    displayComments(commentsArr);
  } catch (err) {
    console.log(err);
  }
}
// Call the function to fetch and display comments
getComments(videoID);

// Container for displaying user comments
let userCommentDiv = document.getElementById("userCommentSection");

// Function to display comments on the page
function displayComments(data) {
  for (let ele of data) {
    let individualCommentDiv = document.createElement("div");
    individualCommentDiv.innerHTML = `
      <div class="userComment channel">
        <img src="${ele.snippet.topLevelComment.snippet.authorProfileImageUrl}">
        <div class="userCommented">
          <p>@${ele.snippet.topLevelComment.snippet.authorDisplayName}</p>
          <p>${ele.snippet.topLevelComment.snippet.textDisplay}</p>
        </div>
      </div>
      <div class="comentLikeDislike">
        <div>
          <i class="fa-regular fa-thumbs-up" style="color: #080808"></i>
          <i class="fa-regular fa-thumbs-down" style="color: #080808"></i>
        </div>
        <p>Reply</p>
      </div>
    `;
    userCommentDiv.appendChild(individualCommentDiv);
  }
}

// Container for recommended videos
let recommendedSectionDiv = document.getElementById("recommendedVideo");

// Function to fetch recommended videos based on the selected video's title
async function getRecommendedVideos(videoTitle) {
  try {
    let response = await fetch(`${BASE_URL}/search?key=${API_KEY}&q=${videoTitle}&maxResults=16&part=snippet`);
    let data = await response.json();
    let arr = data.items;
    // Call a function to display the fetched recommended videos
    displayRecommendedData(arr);
    console.log(data);
  } catch (err) {
    console.log(err);
  }
}
// Call the function to fetch and display recommended videos
getRecommendedVideos(getSelectedVideoInfo.videoTitle);
// Function to display recommended videos on the page
async function displayRecommendedData(data) {
  console.log("erf");
  recommendedSectionDiv.innerHTML = "";
  for (const ele of data) {
    console.log(ele);
    let viewCountObj = await getVideoInfo(ele.id.videoId);
    console.log(viewCountObj);
    ele.viewObject = viewCountObj;
    let channelInfoObject = await getChannelLogo(ele.snippet.channelId);
    console.log(channelInfoObject);
    ele.channelObject = channelInfoObject;
    let displayDuration = calDuration(ele.snippet.publishedAt);
    let recommendedVideoCard = document.createElement("div");
    recommendedVideoCard.className = "recommenedvideoCard";
    recommendedVideoCard.innerHTML = `<img src="${ele.snippet.thumbnails.high.url}">
    <div>
    <div class="channel">
        <h4>${ele.snippet.title}</h4>
    </div>
    <div>
        <p>${ele.snippet.channelTitle}</p>
        <p> ${calculateViews(
      ele.viewObject[0].statistics.viewCount
    )} views , ${displayDuration} ago </p>
    </div>
    </div>`;
    recommendedSectionDiv.appendChild(recommendedVideoCard);
  }
}

// Event listener for owner comments input
let ownerComments = document.getElementById("ownerComment");
ownerComments.addEventListener('keyup', addOwnerComment)
// Function to handle owner comments input
function addOwnerComment(event) {
  if (event.keyCode === 13) {
  }
}

// Modify the code in selectedVideo.js
window.addEventListener("load", () => {
  try {
    showLoader(); // Show loader before loading the video

    if (YT) {
      new YT.Player(VideoContainer, {
        height: "400",
        width: "100%",
        videoId: videoID,
        events: {
          'onReady': function (event) {
            hideLoader(); // Hide loader after the video is ready
          }
        }
      });
    }
  } catch (error) {
    console.error('Error loading video:', error);
  }
});
