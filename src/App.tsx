import { useEffect, useRef, useState } from "react";
import "./App.css";

const offset = BigInt("435075695441838343102");

function getRandomDigits(count: number): string {
  if (count > 10) {
    return getRandomDigits(10) + getRandomDigits(count - 10);
  }
  return String(Math.floor(Math.random() * Math.pow(10, count))).padStart(
    count,
    "0",
  );
}

function App() {
  const [clock, setClock] = useState(() => Date.now());
  const [random_digits, setRandomDigits] = useState(() => getRandomDigits(41));
  const [splitIndex, setSplitIndex] = useState(1);
  const clockTimeRef = useRef<HTMLParagraphElement | null>(null);

  const displayClockText = (BigInt(clock) + offset).toString() + random_digits;
  const firstHalf = displayClockText.slice(0, splitIndex);
  const secondHalf = displayClockText.slice(splitIndex);

  useEffect(() => {
    let frameId = 0;

    const tick = () => {
      setClock(() => Date.now());
      setRandomDigits(() => getRandomDigits(41));
      frameId = requestAnimationFrame(tick);
    };
    console.log(Date.now());

    frameId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frameId);
  }, []);

  useEffect(() => {
    const clockElement = clockTimeRef.current;

    if (!clockElement) {
      return;
    }

    const measureSplitIndex = () => {
      const { width } = clockElement.getBoundingClientRect();
      const styles = window.getComputedStyle(clockElement);
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      if (!context || width === 0) {
        return;
      }

      context.font = styles.font;

      const digitWidth = context.measureText("0").width;
      const nextSplitIndex = Math.min(
        displayClockText.length - 1,
        Math.max(1, Math.floor(width / digitWidth)),
      );

      setSplitIndex((currentSplitIndex) =>
        currentSplitIndex === nextSplitIndex
          ? currentSplitIndex
          : nextSplitIndex,
      );
    };

    measureSplitIndex();

    const resizeObserver = new ResizeObserver(() => {
      measureSplitIndex();
    });

    resizeObserver.observe(clockElement);

    return () => resizeObserver.disconnect();
  }, [displayClockText.length]);

  return (
    <main className="clock-shell">
      <p className="clock-label">The inAuthoritative Universe Tick Clock</p>
      <p className="clock-time" ref={clockTimeRef}>
        <span>{firstHalf}</span>
        <wbr />
        <span>{secondHalf}</span>
      </p>
    </main>
  );
}

export default App;
