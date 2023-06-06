let audio = new Audio("resources/mainTheme.mp3");
audio.loop = true;

function playSound(url) {
  if (!muted) {
    const audioEffects = new Audio(url);
    audioEffects.play();
  }
}
