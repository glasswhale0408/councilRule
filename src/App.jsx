import { useState, useEffect } from "react";
import imgCrocs from "./assets/크록스.png";
import imgSun from "./assets/햇살.png";
import imgUniform from "./assets/교복.png";
import imgVolunteer from "./assets/봉사시간.png";

// =============================================
// ✏️ 여기서 퀴즈 설정을 편집하세요!
// =============================================

// 퀴즈 오픈 시간 설정 (년, 월-1, 일, 시, 분, 초)
const OPEN_TIME = new Date(2026, 4, 29, 12, 30, 0);

// 충여핑 이미지 (base64 내장)
const IMG_CROCS = imgCrocs;
const IMG_SUN = imgSun;
const IMG_UNIFORM = imgUniform;
const IMG_VOLUNTEER = imgVolunteer;

// 문제 목록: answer는 정답 번호 (1~4)
const QUESTIONS = [
  {
    id: 1,
    question: "다음 중 등교 시 벌점 대상인 행동은?",
    options: [
      "질서부 부원들과 선생님께 밝게 인사하기",
      "가방 문 열린 친구의 가방문을 닫아주기",
      "버려진 전단지 주워서 교실 가서 버리기",
      "지비츠가 10개쯤 달린 기깔나는 크록스 신고 등교하기",
    ],
    answer: 4,
    nextLocation: "급식실 앞 개수대", 
    bead: "블루 비즈",
    tiniping: "크록스신고등교하지않아핑",
    img: IMG_CROCS,
  },
  {
    id: 2,
    question: "학교에서 해도 되는 행동은?",
    options: [
      "피카소에 빙의해 외출증, 조퇴증 위조하기",
      "선생님게 밝은 목소리로 인사하기",
      "분리수거장에서 몰래 담배 피다가 걸리면 튀기",
      "선생님께서 지도하시는데 듣는 둥 마는 둥 하며 반항하기",
    ],
    answer: 2,
    nextLocation: "별관 위클래스 쪽 통로",
    bead: "옐로우 비즈",
    tiniping: "봄날의햇살처럼인사해핑",
    img: IMG_SUN,
  },
  {
    id: 3,
    question: "다음 중 교복 규정에 어긋나지 않는 것은?",
    options: [
      "새로 산 신상 청바지+크롭티",
      "회색 바지에 교복 치마 레이어드+생활복 상의",
      "체육복 바지에 로카티",
      "편한 바지에 교복 셔츠",
    ],
    answer: 2,
    nextLocation: "별관 2학년 교무실 쪽 통로",
    bead: "그린 비즈",
    tiniping: "상의교복하나하의교복하나핑",
    img: IMG_UNIFORM,
  },
  {
    id: 4,
    question: "다음 중 봉사시간을 받을 수 있는 공동체 활동은?",
    options: [
      "분리수거와 교실정화활동에 열심히 참여하기",
      "청소시간마다 의자에 영혼처럼 붙어있기",
      "친구 청소하는 모습 보며 감독 모드 들어가기",
      "쓰레기를 발견했지만 마음으로만 치우기",
    ],
    answer: 1,
    nextLocation: "본동 입구",
    bead: "핑크 비즈",
    tiniping: "일한만큼받아요봉사시간핑",
    img: IMG_VOLUNTEER,
  },
];

// =============================================
// 이하 코드 수정은 개발자 영역입니다
// =============================================

const PINGS = ["🌸", "⭐", "🍀", "🌙", "💫", "🎀", "🌈", "✨"];
const OPTION_LABELS = ["①", "②", "③", "④"];

function FloatingPing({ style, emoji }) {
  return (
    <div style={{
      position: "absolute", fontSize: style.size, opacity: style.opacity,
      left: style.left, top: style.top,
      animation: `floatPing ${style.duration}s ease-in-out infinite`,
      animationDelay: style.delay, pointerEvents: "none", userSelect: "none",
    }}>{emoji}</div>
  );
}

function Countdown({ openTime }) {
  const [remaining, setRemaining] = useState(() => openTime - Date.now());
  useEffect(() => {
    const t = setInterval(() => setRemaining(openTime - Date.now()), 1000);
    return () => clearInterval(t);
  }, [openTime]);
  if (remaining <= 0) return null;
  const totalSec = Math.floor(remaining / 1000);
  const hours = Math.floor(totalSec / 3600);
  const minutes = Math.floor((totalSec % 3600) / 60);
  const seconds = totalSec % 60;
  const pad = (n) => String(n).padStart(2, "0");
  return (
    <div style={{ display: "flex", gap: "12px", justifyContent: "center", margin: "1.5rem 0" }}>
      {[["시간", hours], ["분", minutes], ["초", seconds]].map(([label, val]) => (
        <div key={label} style={{
          background: "rgba(255,255,255,0.15)", borderRadius: "12px",
          padding: "12px 18px", minWidth: "64px", textAlign: "center",
          border: "1.5px solid rgba(255,255,255,0.3)",
        }}>
          <div style={{ fontSize: "28px", fontWeight: 700, color: "#fff", fontFamily: "\'Nunito\', sans-serif", lineHeight: 1 }}>{pad(val)}</div>
          <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.7)", marginTop: "4px" }}>{label}</div>
        </div>
      ))}
    </div>
  );
}

export default function ChungyopingQuiz() {
  const [now, setNow] = useState(Date.now());
  const [step, setStep] = useState("waiting");
  const [questionIdx, setQuestionIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [floaters] = useState(() =>
    Array.from({ length: 10 }, (_, i) => ({
      left: `${Math.random() * 88}%`, top: `${Math.random() * 88}%`,
      size: `${14 + Math.random() * 18}px`, opacity: 0.12 + Math.random() * 0.22,
      duration: 3 + Math.random() * 4, delay: `${Math.random() * 3}s`,
      emoji: PINGS[i % PINGS.length],
    }))
  );

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const isOpen = now >= OPEN_TIME.getTime();
  const q = QUESTIONS[questionIdx];

  useEffect(() => {
    if (isOpen && step === "waiting") setStep("quiz");
  }, [isOpen, step]);

  function handleSelect(val) {
    if (showResult) return;
    setSelected(val);
  }

  function handleSubmit() {
    if (selected === null) return;
    setShowResult(true);
    setStep(selected === q.answer ? "success" : "fail");
  }

  function handleRetry() {
    setSelected(null);
    setShowResult(false);
    setStep("quiz");
  }

  function handleNext() {
    if (questionIdx + 1 >= QUESTIONS.length) {
      setStep("complete");
    } else {
      setQuestionIdx((i) => i + 1);
      setSelected(null);
      setShowResult(false);
      setStep("quiz");
    }
  }

  const gradients = [
    "linear-gradient(135deg, #a8d8f8 0%, #7bbcd4 50%, #5a9abf 100%)",
    "linear-gradient(135deg, #fde97a 0%, #f5c842 50%, #e0a820 100%)",
    "linear-gradient(135deg, #a8e6a3 0%, #6dcf67 50%, #4ab544 100%)",
    "linear-gradient(135deg, #fdb8d0 0%, #f87daa 50%, #e8508a 100%)",
  ];
  const bg = step === "complete"
    ? "linear-gradient(135deg, #ffd6e8 0%, #e8b4f0 50%, #b4a0f0 100%)"
    : gradients[questionIdx % gradients.length];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Gaegu:wght@400;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Nunito', sans-serif; }
        @keyframes floatPing {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-14px) rotate(8deg); }
        }
        @keyframes popIn {
          0% { transform: scale(0.75); opacity: 0; }
          70% { transform: scale(1.05); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-5px); }
          80% { transform: translateX(5px); }
        }
        @keyframes revealPing {
          0% { transform: scale(0) rotate(-15deg); opacity: 0; }
          60% { transform: scale(1.15) rotate(5deg); opacity: 1; }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        .pop-in { animation: popIn 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards; }
        .shake { animation: shake 0.45s ease; }
        .reveal-ping { animation: revealPing 0.65s cubic-bezier(0.34,1.56,0.64,1) forwards; }
        .option-btn {
          width: 100%; padding: 14px 16px; border-radius: 16px;
          border: 2px solid rgba(255,255,255,0.35);
          background: rgba(255,255,255,0.12); color: #fff;
          font-size: 15px; font-family: 'Nunito', sans-serif; font-weight: 600;
          cursor: pointer; transition: all 0.18s; text-align: left;
          display: flex; align-items: center; gap: 12px;
          backdrop-filter: blur(4px); line-height: 1.4;
        }
        .option-btn:hover:not(:disabled) {
          background: rgba(255,255,255,0.25); border-color: rgba(255,255,255,0.6);
          transform: translateX(4px);
        }
        .option-btn.selected { background: rgba(255,255,255,0.3); border-color: #fff; box-shadow: 0 0 16px rgba(255,255,255,0.3); }
        .option-btn.correct { background: rgba(100,230,150,0.35); border-color: #6de699; box-shadow: 0 0 16px rgba(100,230,150,0.4); }
        .option-btn.wrong { background: rgba(255,100,100,0.3); border-color: #ff8080; }
        .option-btn:disabled { cursor: default; }
        .option-label {
          min-width: 28px; height: 28px; border-radius: 50%;
          background: rgba(255,255,255,0.25);
          display: flex; align-items: center; justify-content: center;
          font-size: 14px; font-weight: 800; flex-shrink: 0;
        }
        .submit-btn {
          width: 100%; padding: 15px; border-radius: 50px; border: none;
          background: rgba(255,255,255,0.9); color: #7c4dab;
          font-size: 16px; font-weight: 800; font-family: 'Nunito', sans-serif;
          cursor: pointer; transition: all 0.2s;
          box-shadow: 0 4px 20px rgba(0,0,0,0.15); margin-top: 8px;
        }
        .submit-btn:disabled { opacity: 0.35; cursor: not-allowed; }
        .submit-btn:not(:disabled):hover { transform: translateY(-2px); box-shadow: 0 6px 24px rgba(0,0,0,0.2); }
        .next-btn {
          padding: 14px 40px; border-radius: 50px; border: none;
          background: rgba(255,255,255,0.92); color: #7c4dab;
          font-size: 16px; font-weight: 800; font-family: 'Nunito', sans-serif;
          cursor: pointer; transition: all 0.2s;
          box-shadow: 0 4px 20px rgba(0,0,0,0.2);
        }
        .next-btn:hover { transform: translateY(-2px) scale(1.03); }
      `}</style>

      <div style={{
        minHeight: "100vh", background: bg, transition: "background 0.8s ease",
        display: "flex", flexDirection: "column", alignItems: "center",
        justifyContent: "center", padding: "24px 20px",
        position: "relative", overflow: "hidden",
      }}>
        {floaters.map((f, i) => <FloatingPing key={i} style={f} emoji={f.emoji} />)}

        {/* 대기 화면 */}
        {step === "waiting" && (
          <div className="pop-in" style={{ textAlign: "center", zIndex: 1 }}>
            <div style={{ fontSize: "64px", marginBottom: "16px" }}>🔒</div>
            <h1 style={{ fontFamily: "'Gaegu', cursive", fontSize: "32px", color: "#fff", marginBottom: "8px", textShadow: "0 2px 12px rgba(0,0,0,0.2)" }}>
              두근두근 캐치! 충여핑
            </h1>
            <p style={{ color: "rgba(255,255,255,0.85)", fontSize: "15px", marginBottom: "6px" }}>퀴즈는 아직 열리지 않았어요</p>
            <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "13px", marginBottom: "16px" }}>오픈 시간: {OPEN_TIME.toLocaleString("ko-KR")}</p>
            <Countdown openTime={OPEN_TIME.getTime()} />
            <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "12px" }}>시간이 되면 자동으로 열려요 ✨</p>
          </div>
        )}

        {/* 퀴즈 화면 */}
        {step === "quiz" && (
          <div className="pop-in" style={{ width: "100%", maxWidth: "500px", zIndex: 1 }}>
            <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginBottom: "20px" }}>
              {QUESTIONS.map((_, i) => (
                <div key={i} style={{
                  width: "32px", height: "32px", borderRadius: "50%",
                  background: i < questionIdx ? "rgba(255,255,255,0.9)" : i === questionIdx ? "#fff" : "rgba(255,255,255,0.25)",
                  border: i === questionIdx ? "3px solid #fff" : "2px solid rgba(255,255,255,0.35)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "14px", fontWeight: 800,
                  color: i <= questionIdx ? "#9b59b6" : "rgba(255,255,255,0.55)",
                  transition: "all 0.3s",
                  boxShadow: i === questionIdx ? "0 0 14px rgba(255,255,255,0.6)" : "none",
                }}>
                  {i < questionIdx ? "✓" : i + 1}
                </div>
              ))}
            </div>
            <div style={{
              background: "rgba(255,255,255,0.16)", backdropFilter: "blur(14px)",
              borderRadius: "24px", border: "1.5px solid rgba(255,255,255,0.38)", padding: "28px 24px",
            }}>
              <div style={{ textAlign: "center", marginBottom: "20px" }}>
                <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.75)", fontWeight: 700, letterSpacing: "0.06em", marginBottom: "4px" }}>
                  문제 {questionIdx + 1} / {QUESTIONS.length}
                </div>
                <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.6)", marginBottom: "14px" }}>{q.bead} 획득 미션</div>
                <p style={{ fontFamily: "'Gaegu', cursive", fontSize: "21px", color: "#fff", lineHeight: 1.55, textShadow: "0 2px 8px rgba(0,0,0,0.15)" }}>
                  {q.question}
                </p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "16px" }}>
                {q.options.map((opt, idx) => {
                  const optNum = idx + 1;
                  let cls = "option-btn";
                  if (showResult) {
                    if (optNum === q.answer) cls += " correct";
                    else if (optNum === selected && selected !== q.answer) cls += " wrong";
                  } else if (selected === optNum) cls += " selected";
                  return (
                    <button key={idx} className={cls} onClick={() => handleSelect(optNum)} disabled={showResult}>
                      <span className="option-label">{OPTION_LABELS[idx]}</span>
                      <span>{opt}</span>
                    </button>
                  );
                })}
              </div>
              {!showResult && (
                <button className="submit-btn" onClick={handleSubmit} disabled={selected === null}>
                  정답 확인하기 →
                </button>
              )}
              
            </div>
          </div>
        )}

        {/* 성공 화면 */}
        {step === "success" && (
          <div className="pop-in" style={{ width: "100%", maxWidth: "420px", textAlign: "center", zIndex: 1 }}>
            <div style={{
              background: "rgba(255,255,255,0.22)", backdropFilter: "blur(16px)",
              borderRadius: "28px", border: "2.5px solid rgba(255,255,255,0.65)",
              padding: "28px 24px 22px", marginBottom: "16px",
              boxShadow: "0 8px 40px rgba(0,0,0,0.18)",
            }}>
              <div style={{ fontSize: "13px", fontWeight: 800, color: "rgba(255,255,255,0.9)", letterSpacing: "0.12em", marginBottom: "14px" }}>
                ✨ 충여핑 발견! ✨
              </div>
              <img
                className="reveal-ping"
                src={q.img}
                alt={q.tiniping}
                style={{
                  width: "200px", height: "200px", objectFit: "contain",
                  display: "block", margin: "0 auto 14px",
                  filter: "drop-shadow(0 10px 28px rgba(0,0,0,0.3))",
                }}
              />
              <p style={{
                fontFamily: "'Gaegu', cursive", fontSize: "21px", color: "#fff",
                fontWeight: 700, margin: 0, textShadow: "0 2px 10px rgba(0,0,0,0.2)",
                wordBreak: "keep-all", lineHeight: 1.4,
              }}>
                {q.tiniping}
              </p>
            </div>
            <h2 style={{ fontFamily: "'Gaegu', cursive", fontSize: "28px", color: "#fff", marginBottom: "6px", textShadow: "0 2px 12px rgba(0,0,0,0.2)" }}>
              정답이에요!
            </h2>
            <p style={{ color: "rgba(255,255,255,0.85)", fontSize: "15px", marginBottom: "16px" }}>
              <strong>{q.bead}</strong>를 획득했어요 🎀
            </p>
            <div style={{
              background: "rgba(255,255,255,0.16)", backdropFilter: "blur(10px)",
              borderRadius: "18px", border: "1.5px solid rgba(255,255,255,0.35)",
              padding: "16px 20px", marginBottom: "12px",
            }}>
              <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "12px", marginBottom: "5px" }}>다음 장소</p>
              <p style={{ fontFamily: "'Gaegu', cursive", fontSize: "20px", color: "#fff", fontWeight: 700 }}>
                📍 {q.nextLocation}
              </p>
            </div>
            {questionIdx + 1 <= QUESTIONS.length && (
              <div style={{
                background: "rgba(255,255,255,0.13)", backdropFilter: "blur(8px)",
                borderRadius: "14px", border: "1.5px solid rgba(255,255,255,0.3)",
                padding: "12px 16px", marginBottom: "20px",
              }}>
                <p style={{ color: "#fff", fontSize: "14px", fontWeight: 700, margin: 0, lineHeight: 1.5 }}>
                  다음 장소에서 화면📱을 보여주며<br/>
                  <span style={{ fontFamily: "'Gaegu', cursive", fontSize: "18px" }}>
                    "캐치! {q.tiniping}"
                  </span>
                  <br/>이라고 말해주세요!
                </p>
              </div>
            )}
            <button className="next-btn" onClick={handleNext}>
              {questionIdx + 1 >= QUESTIONS.length ? "🎁 선물 받으러 가기!" : "다음 문제 →"}
            </button>
          </div>
        )}

        {/* 실패 화면 */}
        {step === "fail" && (
          <div className="pop-in shake" style={{ width: "100%", maxWidth: "420px", textAlign: "center", zIndex: 1 }}>
            <div style={{ fontSize: "72px", marginBottom: "12px" }}>😢</div>
            <h2 style={{ fontFamily: "'Gaegu', cursive", fontSize: "36px", color: "#fff", marginBottom: "8px", textShadow: "0 2px 12px rgba(0,0,0,0.2)" }}>
              틀렸어요!
            </h2>
            <p style={{ color: "rgba(255,255,255,0.85)", fontSize: "15px", marginBottom: "4px" }}>혼란핑이 방해했나봐요...</p>
            <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "13px", marginBottom: "24px" }}>다시 도전하면 충여핑을 찾을 수 있어요! 💪</p>
            <button className="next-btn" onClick={handleRetry}>다시 도전하기 🔄</button>
          </div>
        )}

        {/* 완료 화면 */}
        {step === "complete" && (
          <div className="pop-in" style={{ width: "100%", maxWidth: "520px", textAlign: "center", zIndex: 1 }}>
            <div style={{ fontSize: "48px", marginBottom: "8px", display: "inline-block", animation: "floatPing 1.8s ease-in-out infinite" }}>👑</div>
            <h2 style={{ fontFamily: "'Gaegu', cursive", fontSize: "32px", color: "#fff", marginBottom: "6px", textShadow: "0 2px 16px rgba(0,0,0,0.2)" }}>
              모든 충여핑 수집 완료!
            </h2>
            <p style={{ color: "rgba(255,255,255,0.9)", fontSize: "15px", marginBottom: "20px" }}>
              공주님은 진정한 교칙 수호자예요 ✨
            </p>

            {/* 수집한 충여핑 4마리 */}
            <div style={{
              display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "20px",
            }}>
              {QUESTIONS.map((qItem) => (
                <div key={qItem.id} style={{
                  background: "rgba(255,255,255,0.2)", backdropFilter: "blur(10px)",
                  borderRadius: "20px", border: "2px solid rgba(255,255,255,0.5)",
                  padding: "16px 12px",
                  display: "flex", flexDirection: "column", alignItems: "center", gap: "10px",
                }}>
                  <img
                    src={qItem.img}
                    alt={qItem.tiniping}
                    style={{
                      width: "110px", height: "110px", objectFit: "contain",
                      filter: "drop-shadow(0 4px 14px rgba(0,0,0,0.22))",
                      animation: "floatPing 3s ease-in-out infinite",
                      animationDelay: `${qItem.id * 0.35}s`,
                    }}
                  />
                  <p style={{
                    fontFamily: "'Gaegu', cursive", fontSize: "13px",
                    color: "#fff", fontWeight: 700, wordBreak: "keep-all",
                    textAlign: "center", lineHeight: 1.3,
                    textShadow: "0 1px 6px rgba(0,0,0,0.2)", margin: 0,
                  }}>
                    {qItem.tiniping}
                  </p>
                </div>
              ))}
            </div>

            <div style={{
              background: "rgba(255,255,255,0.22)", backdropFilter: "blur(10px)",
              borderRadius: "20px", border: "2px solid rgba(255,255,255,0.5)", padding: "20px 24px",
            }}>
              <p style={{ fontFamily: "'Gaegu', cursive", fontSize: "26px", color: "#fff", fontWeight: 700, marginBottom: "8px", textShadow: "0 2px 10px rgba(0,0,0,0.2)" }}>
                🏰 충여왕국을 지켰다!
              </p>
              <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "13px", marginBottom: "4px" }}>선물 수령 장소</p>
              <p style={{ fontFamily: "'Gaegu', cursive", fontSize: "20px", color: "#fff", fontWeight: 700 }}>
                📍 그네 옆 휴게공간으로 가세요
              </p>
            </div>
          </div>
        )}

        {(step === "quiz" || step === "success" || step === "fail") && (
          <div style={{
            position: "fixed", bottom: "14px",
            fontFamily: "'Gaegu', cursive", fontSize: "13px",
            color: "rgba(255,255,255,0.4)", zIndex: 1, pointerEvents: "none",
          }}>
            두근두근 캐치! 충여핑 🌸
          </div>
        )}
      </div>
    </>
  );
}