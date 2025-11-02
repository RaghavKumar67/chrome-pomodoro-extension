import React, { useState, useEffect, useRef } from "react";
import toast, { Toaster } from "react-hot-toast";
import "./popup.css";

export default function Appc() {
  const [time, setTime] = useState(25 * 60); // default 25 min
  const [isRunning, setIsRunning] = useState(false);
  const [customMinutes, setCustomMinutes] = useState("");
  const audioRef = useRef(null);
  const hasEnded = useRef(false); // ✅ prevent duplicate toasts

  // ⏳ Countdown effect
  useEffect(() => {
    let timer;
    if (isRunning && time > 0) {
      hasEnded.current = false; // reset when timer is active again
      timer = setInterval(() => setTime((t) => t - 1), 1000);
    } else if (time === 0 && !hasEnded.current) {
      hasEnded.current = true; // mark as ended
      handleTimerEnd();
    }
    return () => clearInterval(timer);
  }, [isRunning, time]);

  // 🔔 Timer end handler
  const handleTimerEnd = () => {
    setIsRunning(false);
    toast.success("🎉 Time’s up! Take a break!");
    if (audioRef.current) {
      audioRef.current.play().catch(() => {});
    }
  };

  // ▶️ Controls
  const toggleTimer = () => setIsRunning((prev) => !prev);
  const resetTimer = () => {
    setTime(25 * 60);
    setIsRunning(false);
    hasEnded.current = false; // reset flag
  };

  // 🕐 Custom minutes handler
  const handleCustomTime = () => {
    if (!customMinutes || isNaN(customMinutes) || customMinutes <= 0) {
      toast.error("Enter a valid number of minutes");
      return;
    }
    setTime(customMinutes * 60);
    setIsRunning(false);
    hasEnded.current = false;
    toast.success(`⏱ Timer set to ${customMinutes} min`);
  };

  // ⚡ Quick 5s test button
  const handleQuick5s = () => {
    setTime(5);
    setIsRunning(false);
    hasEnded.current = false;
    toast.success("⚡ Quick 5s timer set!");
  };

  // 🕒 Format display
  const minutes = String(Math.floor(time / 60)).padStart(2, "0");
  const seconds = String(time % 60).padStart(2, "0");

  return (
    <div className="popup-container">
      <Toaster position="top-center" />
      <h2>🎯 Focus Timer</h2>

      {/* Quick test button */}
      <button className="quick-btn" onClick={handleQuick5s}>
        ⏳ 5s Timer
      </button>

      <div className="time-display">
        {minutes}:{seconds}
      </div>

      <div className="controls">
        <button onClick={toggleTimer}>{isRunning ? "Pause" : "Start"}</button>
        <button onClick={resetTimer}>Reset</button>
      </div>

      {/* Custom time input */}
      <div className="custom-time" style={{ display: "block" }}>
        <input
          type="number"
          min="1"
          placeholder="Enter minutes"
          value={customMinutes}
          onChange={(e) => setCustomMinutes(e.target.value)}
        />
        <button onClick={handleCustomTime}>Set Custom Time</button>
      </div>

      <audio ref={audioRef} src="/sounds/alert.wav" preload="auto" />
    </div>
  );
}
