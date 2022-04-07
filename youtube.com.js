let interval;

function isYoutubeVideoURL(url) {
    const pattern = /youtube.com\/watch\?v=.+/;

    return pattern.test(url);
}

function pushTimeToVideoURL(url, time) {
    const urlObj = new URL(url);

    urlObj.searchParams.set("t", time);

    const newURL = urlObj.toString();
    history.replaceState({}, "", newURL);
}

function observeYoutubeVideoTimeChange(videoURL) {
    let lastVideoTime = 0;

    interval = setInterval(() => {
        const HTML5VideoPlayer = document.querySelector(".html5-video-player");
        const videoTag = document.querySelector("#movie_player video");

        const videoTime = Math.floor(videoTag.currentTime);

        if (HTML5VideoPlayer.classList.contains("ad-showing")) {
            return;
        }

        if (videoTime !== lastVideoTime) {
            if (lastVideoTime) {
                pushTimeToVideoURL(videoURL, videoTime);
            }

            lastVideoTime = videoTime;
        }
    }, 100);
}

function handleVideoURLTimeAppend() {
    const currentURL = window.location.href;

    if (interval) {
        clearInterval(interval);
    }

    if (isYoutubeVideoURL(currentURL)) {
        observeYoutubeVideoTimeChange(currentURL);
    }
}

window.addEventListener("yt-page-data-updated", handleVideoURLTimeAppend, true);
