import { useEffect, useRef, useState } from "react";
import styles from "./RadioPlayer.module.css";
import playlist from "../data/playlist";

function RadioPlayer() {
  const playerRef = useRef(null);
  const intervalRef = useRef(null);

  const youtubeLoadedRef = useRef(false);
  const shouldPlayRef = useRef(false);

  const currentIndexRef = useRef(0);
  const shuffleRef = useRef(false);
  const repeatRef = useRef(false);

  const [isPlaying, setIsPlaying] = useState(false);
  const [ready, setReady] = useState(false);

  const [title, setTitle] = useState("Chai Adda FM");

  const [artist, setArtist] = useState("Shaam ki chai • Chai Adda FM");

  const [thumbnail, setThumbnail] = useState("");

  const [currentTime, setCurrentTime] = useState(0);

  const [duration, setDuration] = useState(0);

  const [progress, setProgress] = useState(0);

  const [volume, setVolume] = useState(70);

  const [shuffle, setShuffle] = useState(false);

  const [repeat, setRepeat] = useState(false);

  /* ================= SONG INFO ================= */

  const updateSongInfo = (player) => {
    if (!player || !player.getVideoData) return;

    const data = player.getVideoData();

    if (data?.title) {
      setTitle(data.title);
    }

    if (data?.author) {
      setArtist(data.author);
    }

    if (data?.video_id) {
      setThumbnail(`https://i.ytimg.com/vi/${data.video_id}/hqdefault.jpg`);
    }

    const total = player.getDuration();

    if (total > 0) {
      setDuration(total);
    }
  };

  /* ================= NEXT INDEX ================= */

  const getNextIndex = () => {
    if (repeatRef.current) {
      return currentIndexRef.current;
    }

    if (shuffleRef.current && playlist.length > 1) {
      let random;

      do {
        random = Math.floor(Math.random() * playlist.length);
      } while (random === currentIndexRef.current);

      return random;
    }

    return (currentIndexRef.current + 1) % playlist.length;
  };

  /* ================= LOAD SONG ================= */

  const loadSong = (index) => {
    if (!playerRef.current) return;

    currentIndexRef.current = index;

    setCurrentTime(0);
    setProgress(0);

    playerRef.current.loadVideoById(playlist[index]);
  };

  /* ================= YOUTUBE ================= */

  useEffect(() => {
    const createPlayer = () => {
      if (!window.YT || !window.YT.Player || playerRef.current) {
        return;
      }

      playerRef.current = new window.YT.Player("chai-adda-youtube", {
        videoId: playlist[0],

        playerVars: {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          playsinline: 1,
          rel: 0,
          modestbranding: 1,
        },

        events: {
          onReady: (event) => {
            event.target.setVolume(volume);

            updateSongInfo(event.target);

            setReady(true);
            if (shouldPlayRef.current) {
              shouldPlayRef.current = false;
              event.target.playVideo();
            }
          },

          onStateChange: (event) => {
            if (!window.YT) return;

            const states = window.YT.PlayerState;

            if (event.data === states.PLAYING) {
              setIsPlaying(true);
              updateSongInfo(event.target);
            }

            if (event.data === states.PAUSED) {
              setIsPlaying(false);
            }

            if (event.data === states.ENDED) {
              setIsPlaying(false);
              loadSong(getNextIndex());
            }
          },
        },
      });
    };

    const loadYouTube = () => {
      if (youtubeLoadedRef.current) return;

      youtubeLoadedRef.current = true;

      if (window.YT && window.YT.Player) {
        createPlayer();
      } else {
        const script = document.createElement("script");

        script.src = "https://www.youtube.com/iframe_api";

        script.onload = () => {
          window.onYouTubeIframeAPIReady = createPlayer;
        };

        document.body.appendChild(script);
      }
    };

    window.loadChaiAddaYouTube = loadYouTube;

    return () => {
      window.loadChaiAddaYouTube = null;
      window.onYouTubeIframeAPIReady = null;
    };
  }, []);

  /* ================= PROGRESS ================= */

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      const player = playerRef.current;

      if (!player || !player.getCurrentTime || !player.getDuration) {
        return;
      }

      const current = player.getCurrentTime();

      const total = player.getDuration();

      if (total > 0) {
        setCurrentTime(current);
        setDuration(total);

        setProgress((current / total) * 100);
      }
    }, 500);

    return () => {
      clearInterval(intervalRef.current);
    };
  }, []);

  /* ================= PLAY ================= */

  const togglePlay = () => {
    // First click
    if (!playerRef.current) {
      shouldPlayRef.current = true;
      window.loadChaiAddaYouTube?.();
      return;
    }

    if (!ready) return;

    if (isPlaying) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }
  };

  /* ================= NEXT ================= */

  const nextSong = () => {
    loadSong(getNextIndex());
  };

  /* ================= PREVIOUS ================= */

  const previousSong = () => {
    if (!playerRef.current) return;

    if (currentTime > 5) {
      playerRef.current.seekTo(0, true);
      return;
    }

    const index =
      (currentIndexRef.current - 1 + playlist.length) % playlist.length;

    loadSong(index);
  };

  /* ================= SHUFFLE ================= */

  const toggleShuffle = () => {
    const value = !shuffle;

    shuffleRef.current = value;

    setShuffle(value);
  };

  /* ================= REPEAT ================= */

  const toggleRepeat = () => {
    const value = !repeat;

    repeatRef.current = value;

    setRepeat(value);
  };

  /* ================= VOLUME ================= */

  const handleVolume = (event) => {
    const value = Number(event.target.value);

    setVolume(value);

    if (playerRef.current) {
      playerRef.current.setVolume(value);
    }
  };

  /* ================= SEEK ================= */

  const handleSeek = (event) => {
    const value = Number(event.target.value);

    setProgress(value);

    if (playerRef.current) {
      const total = playerRef.current.getDuration();

      const newTime = (value / 100) * total;

      playerRef.current.seekTo(newTime, true);

      setCurrentTime(newTime);
    }
  };

  /* ================= FORMAT ================= */

  const formatTime = (seconds) => {
    if (!seconds || Number.isNaN(seconds)) {
      return "0:00";
    }

    const minutes = Math.floor(seconds / 60);

    const remaining = Math.floor(seconds % 60);

    return `${minutes}:${remaining.toString().padStart(2, "0")}`;
  };

  return (
    <div className={styles.player}>
      {/* Hidden YouTube iframe */}
      <div id="chai-adda-youtube" className={styles.youtube} />

      {/* ARTWORK */}

      <div className={styles.artworkWrap}>
        <div
          className={`${styles.artGlow} ${
            isPlaying ? styles.artGlowActive : ""
          }`}
        />

        <div className={styles.artwork}>
          {thumbnail ? <img src={thumbnail} alt={title} /> : <span>☕</span>}
        </div>

        <span
          className={`${styles.statusDot} ${
            isPlaying ? styles.statusActive : ""
          }`}
        />
      </div>

      {/* INFO */}

      <div className={styles.info}>
        <div className={styles.titleLine}>
          <h3 title={title}>{title}</h3>

          {/* <span>YOUTUBE FM</span> */}

          <span>{isPlaying ? "PLAYING" : "PAUSED"}</span>
        </div>

        <p title={artist}>{artist}</p>

        <div className={styles.progressArea}>
          <input
            type="range"
            min="0"
            max="100"
            step="0.1"
            value={progress}
            onChange={handleSeek}
            style={{
              "--progress": `${progress}%`,
            }}
          />

          <div className={styles.time}>
            <span>{formatTime(currentTime)}</span>

            <span>{formatTime(duration)}</span>
          </div>
        </div>
      </div>

      {/* CONTROLS */}

      <div className={styles.controls}>
        <button
          onClick={toggleShuffle}
          className={shuffle ? styles.active : ""}
          title="Shuffle"
          aria-label="Toggle shuffle"
        >
          ⤨
        </button>

        <button
          onClick={previousSong}
          title="Previous"
          aria-label="Previous song"
        >
          |◀
        </button>

        <button
          id="main-play-button"
          className={styles.play}
          onClick={togglePlay}
          title={isPlaying ? "Pause" : "Play"}
          aria-label={isPlaying ? "Pause music" : "Play music"}
        >
          {isPlaying ? "Ⅱ" : "▶"}
        </button>

        <button onClick={nextSong} title="Next" aria-label="Next song">
          ▶|
        </button>

        <button
          onClick={toggleRepeat}
          className={repeat ? styles.active : ""}
          title="Repeat"
          aria-label="Toggle repeat"
        >
          ↻
        </button>
      </div>

      {/* VOLUME */}

      <div className={styles.volume}>
        <span>◗</span>

        <input
          type="range"
          min="0"
          max="100"
          value={volume}
          onChange={handleVolume}
          style={{
            "--volume": `${volume}%`,
          }}
        />
      </div>
    </div>
  );
}

export default RadioPlayer;
