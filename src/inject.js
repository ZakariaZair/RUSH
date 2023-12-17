//|///////////////////////////////////////\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
//|||||||||||||||||||||||| VIDEO GENERATOR BY QUERY |||||||||||||||||||||||||
//|\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\//////////////////////////////////

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
    downloadLink.classList.add('download-link');
    downloadLink.setAttribute('href', video.video_files[0].link); // Use the first video file link
    downloadLink.setAttribute('download', '');
    downloadLink.textContent = 'Download';

    videoContainer.appendChild(videoTitle);
    videoContainer.appendChild(videoElement);
    videoContainer.appendChild(downloadLink);

    resultsElement.appendChild(videoContainer);
  });
});

//|///////////////////////////////\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
//|||||||||||||||||||||||| TEXT TO SPEECH |||||||||||||||||||||||||||||
//|\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\////////////////////////////////////

document.getElementById('ttsForm').addEventListener('submit', (event) => {
  event.preventDefault();
  const text = document.getElementById('ttsInput').value;
  window.electronAPI.performTextToSpeech(text);
});

window.electronAPI.performTextToSpeech = (text) => {
  ipcRenderer.send('convert-text-to-speech', text);
};

window.electronAPI.receiveTextToSpeechResult = (callback) => {
  ipcRenderer.on('tts-response', (event, audioData) => {
    callback(audioData);
  });
};

window.electronAPI.receiveTextToSpeechResult((audioData) => {
  if (audioData) {
    const audioBlob = new Blob([audioData], { type: 'audio/mp3' });
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);
    console.log('Playing audio');
    audio.play();
  } else {
    console.error('Failed to receive audio data');
  }
});

