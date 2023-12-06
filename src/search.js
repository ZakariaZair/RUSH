document.getElementById('searchForm').addEventListener('submit', (event) => {
  event.preventDefault();
  const query = document.getElementById('searchQuery').value;
  window.electronAPI.performSearch(query);
});

window.electronAPI.receiveSearchResults((videos) => {
  const resultsElement = document.getElementById('results');
  resultsElement.innerHTML = ''; 
  videos.forEach((video) => {
    const videoContainer = document.createElement('div');
    videoContainer.classList.add('video-container'); // Add a class for styling if needed

    const videoTitle = document.createElement('h3');
    videoTitle.textContent = video.title;

    const videoElement = document.createElement('video');
    videoElement.setAttribute('controls', 'controls');
    videoElement.setAttribute('src', video.video_files[0].link); // Use the first video file link

    const downloadLink = document.createElement('a');
    downloadLink.classList.add('download-link'); // Add a class for styling if needed
    downloadLink.setAttribute('href', video.video_files[0].link); // Use the first video file link
    downloadLink.setAttribute('download', '');
    downloadLink.textContent = 'Download';

    videoContainer.appendChild(videoTitle);
    videoContainer.appendChild(videoElement);
    videoContainer.appendChild(downloadLink);

    resultsElement.appendChild(videoContainer);
  });
});