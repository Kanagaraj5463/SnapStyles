import { useEffect } from "react";

const CreatorLevels = () => {
  useEffect(() => {
    const items = document.querySelectorAll(".reveal");
    const onScroll = () => {
      items.forEach((el) => {
        if (el.getBoundingClientRect().top < window.innerHeight - 120) {
          el.classList.add("active");
        }
      });
    };
    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "radial-gradient(circle at top, #0b0b0b, #000 80%)",
        color: "#fff",
        padding: "80px 0",
        position: "relative",
      }}
    >
      {/* Background glitter */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          background:
            "radial-gradient(circle, rgba(255,215,0,0.06) 1px, transparent 1px)",
          backgroundSize: "90px 90px",
          pointerEvents: "none",
        }}
      />

      {/* Header */}
      <div className="text-center mb-5 reveal">
        <h1 style={{ fontSize: "2.6rem", fontWeight: 800 }}>
          Snap Style Levels ⭐
        </h1>
        <p style={{ color: "#aaa" }}>Grow • Earn • Build Legacy</p>
      </div>

      {/* Timeline */}
      <div className="timeline">
        <div className="timeline-line" />

        {/* CREATOR */}
        <div className="timeline-row reveal">
          <div className="content left">
            <h3>🎥 Style Creator</h3>
            <div className="card glow-hover">
              <span className="tag creator-tag">Creator</span>
              <ul className="feature-list">
                <li><span className="dot" />Social media growth support</li>
                <li><span className="dot" />Instagram optimization</li>
                <li><span className="dot" />Monetization (Gifts, Subs, Badges)</li>
                <li><span className="dot" />Professional video editing</li>
                <li><span className="dot" />Brand collaboration access</li>
                <li><span className="dot" />Celebrity & influencer support</li>
              </ul>
            </div>
          </div>
          <div className="node" />
          <div className="spacer" />
        </div>

        {/* CREW */}
        <div className="timeline-row reveal">
          <div className="spacer" />
          <div className="node gold" />
          <div className="content right">
            <h3>🤝 Style Crew</h3>
            <div className="card crew glow-hover">
              <span className="tag crew-tag">Crew</span>
              <ul className="feature-list">
                <li><span className="dot" />All Creator services included</li>
                <li><span className="dot" />Free personalized shoots</li>
                <li><span className="dot" />Yearly free travel & tours</li>
                <li><span className="dot" />Work with Style Pilot team</li>
                <li><span className="dot" />Priority brand collaborations</li>
              </ul>
            </div>
          </div>
        </div>

        {/* PILOT */}
        <div className="timeline-row reveal">
          <div className="content left">
            <h3>🚀 Style Pilot</h3>
            <div className="card glow-hover">
              <span className="tag pilot-tag">Pilot</span>
              <ul className="feature-list">
                <li><span className="dot" />High-value brand projects</li>
                <li><span className="dot" />Celebrity campaigns</li>
                <li><span className="dot" />Full-time income opportunities</li>
                <li><span className="dot" />Leadership & equity growth</li>
              </ul>
            </div>
          </div>
          <div className="node blue" />
          <div className="spacer" />
        </div>
      </div>

      {/* Styles */}
      <style>{`
        .timeline {
          max-width: 1100px;
          margin: 0 auto;
          position: relative;
        }

        .timeline-line {
          position: absolute;
          top: 0;
          bottom: 0;
          left: 50%;
          width: 4px;
          transform: translateX(-50%);
          background: linear-gradient(to bottom, #f9d423, #ff4e50, #2a52c3);
          box-shadow: 0 0 25px rgba(255,215,0,.6);
        }

        .timeline-row {
          display: grid;
          grid-template-columns: 1fr 80px 1fr;
          align-items: center;
          margin: 120px 0;
        }

        .content.left {
          text-align: right;
          padding-right: 40px;
          justify-self: end;
        }

        .content.right {
          padding-left: 40px;
          justify-self: start;
        }

        .node {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #f9d423;
          box-shadow: 0 0 20px rgba(255,215,0,.9);
          justify-self: center;
        }

        .node.gold { background: #ff4e50; }
        .node.blue { background: #2a52c3; }

        .card {
          background: rgba(255,255,255,0.08);
          padding: 24px;
          border-radius: 18px;
          transition: all 0.35s ease;
          position: relative;
          overflow: hidden;
        }

        /* ✨ GLOW + GLITTER HOVER */
        .glow-hover:hover {
          box-shadow:
            0 0 35px rgba(255,215,0,.6),
            0 0 70px rgba(255,215,0,.25);
          transform: translateY(-6px);
        }

        .glow-hover::after {
          content: "";
          position: absolute;
          inset: -40%;
          background: radial-gradient(circle, rgba(255,215,0,.25), transparent 60%);
          opacity: 0;
          transition: opacity 0.4s;
        }

        .glow-hover:hover::after {
          opacity: 1;
          animation: shimmer 2.2s linear infinite;
        }

        @keyframes shimmer {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        /* 🔹 Bullet alignment */
        .feature-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .feature-list li {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          margin-bottom: 8px;
          line-height: 1.45;
        }

        .dot {
          width: 6px;
          height: 6px;
          margin-top: 8px;
          border-radius: 50%;
          background: #f9d423;
          flex-shrink: 0;
        }

        .tag {
          display: inline-block;
          margin-bottom: 12px;
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: bold;
        }

        .creator-tag { background: #f9d423; color: #000; }
        .crew-tag { background: #ff4e50; }
        .pilot-tag { background: #2a52c3; }

        .reveal {
          opacity: 0;
          transform: translateY(60px);
          transition: all 0.9s ease;
        }

        .reveal.active {
          opacity: 1;
          transform: none;
        }
      `}</style>
    </div>
  );
};

export default CreatorLevels;
