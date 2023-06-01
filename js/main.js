//Inicializando el indice y el booleano que me indica si se repite una canción o no.

let currentMusic = 0;
let isRepeatActive = false;

//Creando e inicializando las const para las diferentes funciones del reproductor.

const playS = document.getElementById("btn-play");
const songs1 = document.querySelector(".songA");
const volumen = document.getElementById("volumenSlider");
const image = document.getElementById("imageS");
const title = document.getElementById("title");
const artist = document.getElementById("artist");
const backward = document.getElementById("btn-backward");
const forward = document.getElementById("btn-forward");
const iconPP = document.getElementById("play-pause");
const iconV = document.getElementById("volume-icon");
const currentTime = document.querySelector(".current-time");
const musicDuration = document.querySelector(".song-duration");
const seekBar = document.querySelector(".seek-bar");
const shuffle = document.getElementById("btn-shuffle");
const repeat = document.getElementById("btn-repeat");
const iconR = document.getElementById("icon-repeat");
const liked = document.getElementById("liked");

//Actualizo el volumen de la canción con el input de tipo range.

volumenSlider.addEventListener("input", () => {
  songs1.volume = volumenSlider.value;
});

//Actualizo el estado de la canción y cambio según el estado, el tipo de botón.

playS.addEventListener("click", () => {
  if (iconPP.className.includes("fa-play")) {
    iconPP.classList.remove("fa-play");
    iconPP.classList.add("fa-pause");
    songs1.play();
  } else {
    iconPP.classList.remove("fa-pause");
    iconPP.classList.add("fa-play");
    songs1.pause();
  }
});

//Obtengo mediante una promises la información del archivo .json y cuando la obtengo llamo a la función changeSong para settear
//la url de la imagen, la ruta de la canción y la información de la artista.

let songs;

async function obtenerInfo() {
  try {
    const response = await fetch("data.json");
    const data = await response.json();
    songs = data;
  } catch (error) {
    console.error("Error al obtener los datos:", error);
  }
}

obtenerInfo()
  .then(() => {
    changeSong(0);
  })
  .catch((error) => {
    console.error("Error al obtener los datos:", error);
  });

function changeSong(i) {
  seekBar.value = 0;
  let song = songs[i];
  currentMusic = i;

  image.src = song.image;
  title.innerHTML = song.nameSong;
  artist.innerHTML = song.artist;
  songs1.src = song.path;

  currentTime.innerHTML = "00:00";
  setTimeout(() => {
    seekBar.max = songs1.duration;
    musicDuration.innerHTML = formatTime(songs1.duration);
  }, 300);
}

//Tomo el tiempo de la canción y lo convierto a minutos y segundos redondos.

const formatTime = (time) => {
  let min = Math.floor(time / 60);
  if (min < 10) {
    min = `0${min}`;
  }
  let sec = Math.floor(time % 60);
  if (sec < 10) {
    sec = `0${sec}`;
  }
  return `${min}:${sec}`;
};

//Voy setteando la barra que marca la duración y el tiempo que lleva reproducciendose.
//Y cuando la canción termina, reproduce la siguiente.

setInterval(() => {
  seekBar.value = songs1.currentTime;
  currentTime.innerHTML = formatTime(songs1.currentTime);
  if (Math.floor(songs1.currentTime) == Math.floor(seekBar.max)) {
    forward.click();
  }
}, 500);

seekBar.addEventListener("change", () => {
  songs1.currentTime = seekBar.value;
});

//Tocando el botón vuelve a la canción anterior, y se reproduce automaticamente.

backward.addEventListener("click", () => {
  if (currentMusic <= 0) {
    currentMusic = songs.length - 1;
  } else {
    currentMusic--;
  }
  changeSong(currentMusic);
  if (iconPP.className.includes("fa-play")) {
    iconPP.classList.remove("fa-play");
    iconPP.classList.add("fa-pause");
  }
  songs1.play();
});

//Hago que el botón reproduzca una canción al azar sin repetir la canción actual,
//llamo a una función random para crear la aleatoriedad.

function generarRandom(x) {
  let nRandom = Math.floor(Math.random() * (x + 1));
  return nRandom;
}

shuffle.addEventListener("click", () => {
  let actualSong=currentMusic
  let random=generarRandom(songs.length - 1)
  while(random===actualSong){
    random=generarRandom(songs.length - 1)
  }
  changeSong(random);
  if (iconPP.className.includes("fa-play")) {
    iconPP.classList.remove("fa-play");
    iconPP.classList.add("fa-pause");
  }
  songs1.play();
});

//Hago que cuando se apriete el boton se pase a la siguiente canción.
//Se cambie el icono a pause, ya que la canción va arrancar automaticamente
//Y si el botón de repetir está activo, va a repetir la canción actual

forward.addEventListener("click", () => {
  if (currentMusic >= songs.length - 1) {
    currentMusic = 0;
  } else {
    currentMusic++;
  }

  if (iconPP.className.includes("fa-play")) {
    iconPP.classList.remove("fa-play");
    iconPP.classList.add("fa-pause");
  }
  if (isRepeatActive) {
    changeSong(currentMusic - 1);
    songs1.play();
  } else {
    changeSong(currentMusic);
    songs1.play();
  }
});

//Hago que cuando se active, se settee un booleano que va a interractuar con el botón
// de forward. 

repeat.addEventListener("click", () => {
  if (iconR.className.includes("active")) {
    iconR.classList.remove("active");
    isRepeatActive = false;
  } else {
    iconR.classList.add("active");
    isRepeatActive = true;
  }
});

//Hago que cuando se active, se le agregue una clase .active y se guarde en un boolean
//si está likeado para que cuando la página se recargue, aparezca con la clase indicando
//que si se guardó en el localStorage.

liked.addEventListener("click", () => {
  const isLiked = liked.classList.toggle("active");
  localStorage.setItem("isLiked", isLiked);
});

window.addEventListener("load", () => {
  const isLiked = localStorage.getItem("isLiked") === "true";
  if (isLiked) {
    liked.classList.add("active");
  } else {
    liked.classList.remove("active");
  }
});
