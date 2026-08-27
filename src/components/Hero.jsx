import { useEffect, useState } from "react";
import styles from "./Hero.module.css";

import chaiImage from "../assets/images/chai-adda-bg.webp";

function Hero() {
  const [currentTime, setCurrentTime] = useState("");

  const [mousePosition, setMousePosition] = useState({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;

      setMousePosition({
        x,
        y,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  /* ================= REAL TIME CLOCK ================= */

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();

      setCurrentTime(
        now.toLocaleTimeString("en-IN", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        }),
      );
    };

    updateTime();

    const timer = setInterval(updateTime, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <main>
      {/* =====================================================
          HERO
          ===================================================== */}

      <section id="radio" className={styles.hero}>
        {/* BACKGROUND */}

        <img
          src={chaiImage}
          alt="Chai Adda FM"
          className={styles.backgroundImage}
          style={{
            transform: `scale(1.05) translate3d(${-mousePosition.x * 10}px, ${
              -mousePosition.y * 10
            }px, 0)`,
          }}
        />

        <div className={styles.darkOverlay} />
        <div className={styles.vignette} />

        {/* =====================================================
            NAVBAR
            ===================================================== */}

        <nav className={styles.navbar}>
          <div className={styles.brand}>
            <div className={styles.brandCup}>☕</div>

            <div>
              <div className={styles.brandName}>Chai Adda FM</div>

              <div className={styles.brandSub}>THE DIGITAL ADDA</div>
            </div>
          </div>

          <div className={styles.navLinks}>
            <a href="#about">About</a>
          </div>
        </nav>

        {/* =====================================================
            TOP INFO
            ===================================================== */}

        <div className={styles.topInfo}>
          <span className={styles.clock}>{currentTime}</span>

          {/* <span>EST. 2026</span>

          <span>24 / 7 RADIO</span> */}
        </div>

        {/* =====================================================
            HERO CONTENT
            ===================================================== */}

        <div className={styles.heroContent}>
          <div className={styles.liveLabel}>
            <span className={styles.liveDot}></span>
            LIVE FROM THE ADDA
          </div>

          <h1>
            <span>Chai</span>

            <span className={styles.adda}>Adda</span>

            <small>
              FM <span className={styles.radio}>24/7 RADIO</span>
            </small>
          </h1>

          <p className={styles.tagline}>
            एक चाय की चुस्की, दो यार,
            <br />
            हर Suffer बन जाए सफ़र बार-बार…
          </p>

          {/* Optional description */}

          {/* 
          <p className={styles.description}>
            Ek cup chai.
            <br />
            Ek kahani.
            <br />
            Aur background mein apna music.
          </p>
          */}

          <button
            className={styles.listenButton}
            onClick={() => document.getElementById("main-play-button")?.click()}
          >
            <span>▶</span>
            LISTEN LIVE
          </button>
          <br />
          <a href="#adda-story" className={styles.storyLink}>
            <span>THE STORY</span>

            <b>↓</b>
          </a>
        </div>

        {/* =====================================================
            HERO BOTTOM
            ===================================================== */}

        <div className={styles.heroBottom}>
          <span>SHAAM KI CHAI</span>

          <a href="mailto:pradumnshukla777@gmail.com">CONTACT ↗</a>
        </div>
      </section>

      {/* =====================================================
          CHAI ADDA FM STORY
          ===================================================== */}

      <section id="adda-story" className={styles.addaStory}>
        <div className={styles.addaStoryInner}>
          {/* TOP */}

          <div className={styles.addaStoryTop}>
            <span>THE IDEA BEHIND THE ADDA</span>

            <span>00 — 01</span>
          </div>

          {/* MAIN STORY */}

          <div className={styles.addaStoryContent}>
            {/* LEFT */}

            <div className={styles.addaStoryTitle}>
              <h2>
                एक प्याली
                <br />
                <em>सुकून की..</em>
              </h2>
              <br />
              <span>CHAI ADDA FM</span>
            </div>

            {/* RIGHT */}

            <div className={styles.addaStoryText}>
              <span className={styles.addaStoryLabel}>
                A DIGITAL CHAI ADDA • PLAYING LIVE
              </span>

              <p>
                Chai Adda FM ek jagah hai jahan chai sirf chai nahi — ek feeling
                hai..
              </p>

              <p>
                Kabhi shaam ki thakan ke saath, kabhi raat ke safar mein, aur
                kabhi bas bina kisi wajah ke... yahan music chalta rahega.
              </p>

              <p>
                Ek virtual chai tapri, jahan duniya thodi der ke liye slow ho
                jaati hai. Bas Aap suno, chai ko imagine karo, aur apna waqt
                enjoy karo.
              </p>

              {/* QUOTE */}

              <div className={styles.addaStoryQuote}>
                <span>“</span>

                <p>
                  "चाय में डूबा हुआ बिस्कुट <br />
                  और प्यार में डूबा हुआ दोस्त <br />
                  किसी काम का नहीं"
                </p>
              </div>
            </div>
          </div>

          {/* BOTTOM */}

          <div className={styles.addaStoryBottom}>
            <span>CHAI • MUSIC • BAATEIN • YADEIN</span>

            <span>DIL SE • SEEDHA AAP TAK</span>
          </div>
        </div>
      </section>

      {/* =====================================================
          ABOUT / CREATOR
          ===================================================== */}

      <section id="about" className={styles.about}>
        <div className={styles.aboutBlur} />

        <div className={styles.aboutContainer}>
          {/* HEADER */}

          <div className={styles.aboutHeader}>
            <span>THE PERSON BEHIND THE ADDA</span>

            <span>01 — 01</span>
          </div>

          {/* MAIN */}

          <div className={styles.aboutGrid}>
            {/* NAME */}

            <div className={styles.aboutName}>
              <h2>Pradumn</h2>

              <h2>Shukla</h2>

              <span>MADE FOR THE PEOPLE</span>
            </div>

            {/* ABOUT TEXT */}

            <div className={styles.aboutText}>
              <span className={styles.aboutRole}>
                CREATOR • DEVELOPER • DREAMER
              </span>

              <p>
                I'm Pradumn — a developer who enjoys turning simple ideas into
                experiences that feel alive.
              </p>

              <p>
                Chai Adda FM is my little digital adda, built around chai,
                music, stories and those quiet moments when you just want to sit
                back and let the world slow down. <br />
                “I made an online chai adda where you can come, press play, and
                enjoy music like you're sitting at a chai tapri.” ☕🎶
              </p>

              <p>
                No complicated place.
                <br />
                Just chai, music and good vibes with friends and close ones...
              </p>

              {/* EMAIL */}

              <a
                href="mailto:pradumnshukla777@gmail.com"
                className={styles.email}
              >
                pradumnshukla777@gmail.com
                <span>↗</span>
              </a>
            </div>
          </div>

          {/* FOOTER */}

          <div className={styles.aboutFooter}>
            <span>CHAI • MUSIC • STORIES</span>

            <span>© 2026 CHAI ADDA FM</span>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Hero;
