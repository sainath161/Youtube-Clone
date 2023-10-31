let API = "AIzaSyBtRQja8g3Rm7li_gzu36RRq4EibDqbBJs";

async function mostPopular() {
    let res = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=100&chart=mostPopular&regionCode=IN&key=${API}`);
    let data = await res.json();
    append(data.items);
    // console.log(data.items);
}
mostPopular();

mostPopular();

function append(data) {
  let container = document.getElementById("container");
  data.forEach(({ snippet, id: { videoId } }) => {
    let img = snippet.thumbnails.high.url;
    let title = snippet.title;
    let channelTitle = snippet.channelTitle;
    let div = document.createElement("div");
    let image = document.createElement("img");
    image.src = img;
    let detailsDiv = document.createElement("div"); // Create a container for details
    let name = document.createElement("p");
    name.innerText = title;
    name.style.color = "white";
    let Cname = document.createElement("p");
    Cname.innerText = channelTitle;
    Cname.style.color = "white";
    detailsDiv.appendChild(name);
    detailsDiv.appendChild(Cname);
    // let data = {
    //     snippet,
    //     videoId
    // }
    // div.addEventListener("click", function() {
    //     localStorage.setItem("video", JSON.stringify(data));
    //     window.location.href = 
    // })
    div.appendChild(image);
    div.appendChild(detailsDiv); // Append the details container to the main div
    container.appendChild(div);
  });
}