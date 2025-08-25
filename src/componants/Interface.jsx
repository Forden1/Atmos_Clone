import { useRef, useEffect } from "react";
import gsap from "gsap";

export default function Interface({ setStart, start }) {
  const containerRef = useRef(null);
  const lettersRef = useRef([]);

  const text = "Forden";

  // Animate letters individually on mount
  useEffect(() => {
    lettersRef.current.forEach((el, i) => {
      gsap.fromTo(
        el,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", delay: i * 0.1 }
      );
    });
  }, []);

  // Animate container to top when Play is clicked
  useEffect(() => {
    if (start && containerRef.current) {
      gsap.to(containerRef.current, {
        top: "5%", // moves near top of screen
        y: 0,
        duration: 1.2,
        ease: "power3.inOut",
      });

      gsap.to(containerRef.current, {
        scale: 0.6, // make it smaller when at top
        duration: 1.2,
        ease: "power3.inOut",
        delay: 0.2,
      });
    }
  }, [start]);

  // Split text into letters
  const letters = text.split("").map((char, i) => (
    <span
      key={i}
      ref={(el) => (lettersRef.current[i] = el)}
      style={{ display: "inline-block", marginRight: "2px" }}
    >
      {char}
    </span>
  ));

  return (
    <>
      
      <div
       
        ref={containerRef}
        style={{
          position: "fixed",
          top: "43%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "6rem",
          fontWeight: "bold",
          color: "white",
          zIndex: 100,
          pointerEvents: "none",
        }}
      >
        {letters}
      </div>

      {!start && (
        <button onClick={() => setStart(true)} className="play-btn">
          <span>Play</span>
        </button>
      )}
    </>
  );
}
