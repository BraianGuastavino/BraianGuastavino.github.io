let currentMusic= 0;

const music= document.querySelector('#audio');

const seekBar = document.querySelector('.seek-bar');
const songName = document.querySelector('.music-name');
const artistName = document.querySelector('.artist-name');
const disk = document.querySelector('.disk');
const currentTime = document.querySelector('.current-time');
const musicDuration = document.querySelector('.song-duration');
const playBtn = document.querySelector('.play-btn');
const forwardBtn = document.querySelector('.forward-btn');
const backwarBtn = document.querySelector('.backward-btn');
const likeButton = document.querySelector('#like-button');
const likeBtn = document.getElementById("likeBtn");

playBtn.addEventListener('click',()=>{
    if(playBtn.className.includes('pause')){
        music.play();
    }else{
        music.pause();
    }
    playBtn.classList.toggle('pause');
})

const setMusic = (i) => {
    seekBar.value =0;
    let song = songs[i];
    currentMusic = i;
    music.src= song.path;

    songName.innerHTML = song.name;
    artistName.innerHTML = song.artist;
    disk.style.backgroundImage = `url('${song.cover}')`;
  
    currentTime.innerHTML = '00:00';
    setTimeout(()=>{
        seekBar.max= music.duration;
        musicDuration.innerHTML = formatTime(music.duration);
    }, 300);
}

setMusic(0);

const formatTime = (time) => {
    let min = Math.floor(time / 60);
    if(min < 10){
        min = `0${min}`;
    }
    let sec= Math.floor(time % 60);
    if(sec < 10){
        sec = `0${sec}`;
    }
    return `${min}:${sec}`;
}

setInterval(()=> {
    seekBar.value = music.currentTime;
    currentTime.innerHTML = formatTime(music.currentTime);
    if(Math.floor(music.currentTime) == Math.floor(seekBar.max)){
        forwardBtn.click()
    }
},500)

seekBar.addEventListener('change',()=>{
    music.currentTime= seekBar.value;
})

const playMusic = () => {
    music.play();
    playBtn.classList.remove('pause');
}

forwardBtn.addEventListener('click',()=>{
    if(currentMusic >=songs.length-1){
        currentMusic=0;
    }else{
        currentMusic++;
    }
    setMusic(currentMusic);
    playMusic();
})

backwarBtn.addEventListener('click',()=>{
    if(currentMusic <= 0){
        currentMusic= songs.length - 1;
    }else{
        currentMusic--;
    }
    setMusic(currentMusic);
    playMusic();
})




function toggleLikeButton() {
  // Recuperar el valor almacenado en el almacenamiento local
  const isLiked = localStorage.getItem("isLiked");

  if (isLiked === "true") {
    // Si el botón se ha marcado como "me gusta", cambiar la apariencia del botón para que aparezca como "likeado"
    likeButton.classList.add("liked");
  }

  likeButton.addEventListener("click", function () {
    if (likeButton.classList.contains("liked")) {
      // Si el botón ya estaba likeado, remover la clase "liked", actualizar el almacenamiento local y actualizar la apariencia
      likeButton.classList.remove("liked");
      localStorage.setItem("isLiked", "false");
    } else {
      // Si el botón no estaba likeado, agregar la clase "liked", actualizar el almacenamiento local y actualizar la apariencia
      likeButton.classList.add("liked");
      localStorage.setItem("isLiked", "true");
    }
  });
}

toggleLikeButton();