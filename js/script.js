
let currentSong = new Audio();
let songs;
async function getSongs() {
    let a = await fetch("/songs/");
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    songs = [];
    for (let i = 0; i < as.length; i++) {
        const element = as[i];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split("/songs/")[1]);
        }
    }
    return songs;
}

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

const playMusic = (track, pause = false) => {
    currentSong.src = "/songs/" + track;
    if (!pause) {
        currentSong.play();
        play.src = "svg/pause.svg";
    }
    document.querySelector(".songInfo").innerHTML = decodeURI(track);
    document.querySelector(".songTime").innerHTML = "00:00/ 00:00";
}

async function main() {
    songs = await getSongs();
    playMusic(songs[0], true);

    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0];
    for (const song of songs) {
        console.log(song);
        songUL.innerHTML = songUL.innerHTML +
            '                    <li>\n' +
            '                        <img class="invert" src="svg/music.svg" alt="">\n' +
            '                        <div class="info">\n' +
            '                            <div>'+song+'</div>\n' +
            '                            <div>Tayyab</div>\n' +
            '                            <div class="playNow">\n' +
            '                                <span> Play Now</span>\n' +
            '                                <img class="invert"  src="svg/play.svg" alt="">\n' +
            '                            </div>\n' +
            '                        </div>\n' +
            '                    </li>\n' +
            '  '
    }
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim(),false);

        })
    })

    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            play.src = "svg/pause.svg";
        } else {
            currentSong.pause();
            play.src = "svg/play.svg"
        }
    })

    currentSong.addEventListener("timeupdate", () => {
        console.log(currentSong.currentTime, currentSong.duration);
        document.querySelector(".songTime").innerHTML = document.querySelector(".songTime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`;
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + '%';
    })

    document.querySelector(".seekBar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + '%';
        currentSong.currentTime = (currentSong.duration) * percent / 100;

    })
    document.querySelector(".hamburger").addEventListener("click", e => {
        document.querySelector(".left").style.left = "0";
    })
    document.querySelector(".close").addEventListener("click", e => {
        document.querySelector(".left").style.left = "-120%";
    })
    previous.addEventListener("click", () => {
        let index= songs.indexOf(currentSong.src.split("/".slice(-1)[0]))
        if ((index-1)>0)
        {
            playMusic(songs[index-1],false)
        }
    })
    next.addEventListener("click", () => {
        let index= songs.indexOf(currentSong.src.split("/".slice(-1)[0])[4])
        console.log(index,typeof(index));
        console.log(currentSong.src.split("/".slice(-1)[0]));
        if ((index+1)<songs.length)
        {
            playMusic(songs[index+1],false)
        }
    })

}
// main();