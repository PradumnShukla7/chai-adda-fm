import styles from "./App.module.css";
import Hero from "./components/Hero";
import RadioPlayer from "./components/RadioPlayer";

function App() {
  return (
    <div className={styles.app}>
      <Hero />
      <RadioPlayer />
    </div>
  );
}

export default App;
