import { useState, useEffect } from "react";

// =============================================
// ✏️ 여기서 퀴즈 설정을 편집하세요!
// =============================================

// 퀴즈 오픈 시간 설정 (년, 월-1, 일, 시, 분, 초)
// 예: new Date(2024, 9, 15, 9, 0, 0) = 2024년 10월 15일 오전 9시
const OPEN_TIME = new Date(2026, 4, 22, 14, 5, 0);

// 문제 목록
// answer: 정답 보기 번호 (1~4)
// options: 보기 4개 배열
// nextLocation: 이 문제를 맞히면 이동할 장소
const QUESTIONS = [
  {
    id: 1,
    question: "수업 시간 중 스마트폰 사용 시, 올바른 행동은 무엇인가요?",
    options: [
      "선생님 몰래 책상 아래서 사용한다",
      "전원을 끄거나 가방에 넣어 보관한다",
      "이어폰을 꽂고 소리 없이 사용한다",
      "친구와 함께 조용히 게임을 한다",
    ],
    answer: 2,
    nextLocation: "2번 부스 (도서관 앞)",
    bead: "핑크 비즈",
    hint: "교칙 제 12조 — 수업 중 전자기기 사용 금지",
  },
  {
    id: 2,
    question: "복도에서 지켜야 할 올바른 행동은 무엇인가요?",
    options: [
      "친구와 경주하듯 빠르게 달린다",
      "음악을 들으며 이어폰을 끼고 걷는다",
      "오른쪽으로 조용히 걸어다닌다",
      "큰 소리로 친구를 부르며 뛰어간다",
    ],
    answer: 3,
    nextLocation: "3번 부스 (급식실 앞)",
    bead: "보라 비즈",
    hint: "교칙 제 5조 — 복도 내 안전보행 의무",
  },
  {
    id: 3,
    question: "급식 후 잔반 처리 방법으로 올바른 것은?",
    options: [
      "귀찮으면 그냥 쟁반째 반납한다",
      "음식물과 일반쓰레기를 한 곳에 버린다",
      "잔반은 지정된 잔반통에, 쓰레기는 분리수거한다",
      "친구 쟁반에 몰래 옮겨 담는다",
    ],
    answer: 3,
    nextLocation: "4번 부스 (운동장 입구)",
    bead: "초록 비즈",
    hint: "교칙 제 8조 — 급식 후 잔반 처리 규정",
  },
  {
    id: 4,
    question: "교복에 관한 올바른 설명은 무엇인가요?",
    options: [
      "더운 날엔 사복을 입어도 된다",
      "교복은 선택 사항이다",
      "등교 시 반드시 교복을 착용해야 한다",
      "체육복은 교복 대신 입을 수 있다",
    ],
    answer: 3,
    nextLocation: "학생회 부스 (본관 1층)에서 선물을 받으세요! 🎁",
    bead: "노랑 비즈",
    hint: "교칙 제 2조 — 교복 착용 의무",
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
      position: "absolute",
      fontSize: style.size,
      opacity: style.opacity,
      left: style.left,
      top: style.top,
      animation: `floatPing ${style.duration}s ease-in-out infinite`,
      animationDelay: style.delay,
      pointerEvents: "none",
      userSelect: "none",
    }}>
      {emoji}
    </div>
  );
}

function Countdown({ openTime }) {
  const [remaining, setRemaining] = useState(() => openTime - Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      setRemaining(openTime - Date.now());
    }, 1000);
    return () => clearInterval(timer);
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
          background: "rgba(255,255,255,0.15)",
          borderRadius: "12px",
          padding: "12px 18px",
          minWidth: "64px",
          textAlign: "center",
          border: "1.5px solid rgba(255,255,255,0.3)",
        }}>
          <div style={{ fontSize: "28px", fontWeight: 700, color: "#fff", fontFamily: "'Nunito', sans-serif", lineHeight: 1 }}>{pad(val)}</div>
          <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.7)", marginTop: "4px" }}>{label}</div>
        </div>
      ))}
    </div>
  );
}

export default function ChungyopingQuiz() {
  const [now, setNow] = useState(Date.now());
  const [step, setStep] = useState("waiting"); // waiting | quiz | success | fail | complete
  const [questionIdx, setQuestionIdx] = useState(0);
  const [selected, setSelected] = useState(null); // 1~4
  const [showResult, setShowResult] = useState(false);
  const [floaters] = useState(() =>
    Array.from({ length: 10 }, (_, i) => ({
      left: `${Math.random() * 88}%`,
      top: `${Math.random() * 88}%`,
      size: `${14 + Math.random() * 18}px`,
      opacity: 0.12 + Math.random() * 0.22,
      duration: 3 + Math.random() * 4,
      delay: `${Math.random() * 3}s`,
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
    if (selected === q.answer) {
      setStep("success");
    } else {
      setStep("fail");
    }
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
    "linear-gradient(135deg, #f8a4c8 0%, #c97fd4 50%, #8b6fcf 100%)",
    "linear-gradient(135deg, #a4b8f8 0%, #7f8fd4 50%, #6f6fcf 100%)",
    "linear-gradient(135deg, #a4f8d4 0%, #7fd4b0 50%, #6fcfaa 100%)",
    "linear-gradient(135deg, #f8e4a4 0%, #d4c07f 50%, #cfa86f 100%)",
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
        .pop-in { animation: popIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
        .shake { animation: shake 0.45s ease; }

        .option-btn {
          width: 100%;
          padding: 14px 16px;
          border-radius: 16px;
          border: 2px solid rgba(255,255,255,0.35);
          background: rgba(255,255,255,0.12);
          color: #fff;
          font-size: 15px;
          font-family: 'Nunito', sans-serif;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.18s;
          text-align: left;
          display: flex;
          align-items: center;
          gap: 12px;
          backdrop-filter: blur(4px);
          line-height: 1.4;
        }
        .option-btn:hover:not(:disabled) {
          background: rgba(255,255,255,0.25);
          border-color: rgba(255,255,255,0.6);
          transform: translateX(4px);
        }
        .option-btn.selected {
          background: rgba(255,255,255,0.3);
          border-color: #fff;
          box-shadow: 0 0 16px rgba(255,255,255,0.3);
        }
        .option-btn.correct {
          background: rgba(100,230,150,0.35);
          border-color: #6de699;
          box-shadow: 0 0 16px rgba(100,230,150,0.4);
        }
        .option-btn.wrong {
          background: rgba(255,100,100,0.3);
          border-color: #ff8080;
        }
        .option-btn:disabled { cursor: default; }

        .option-label {
          min-width: 28px; height: 28px;
          border-radius: 50%;
          background: rgba(255,255,255,0.25);
          display: flex; align-items: center; justify-content: center;
          font-size: 14px; font-weight: 800;
          flex-shrink: 0;
        }
        .submit-btn {
          width: 100%;
          padding: 15px;
          border-radius: 50px;
          border: none;
          background: rgba(255,255,255,0.9);
          color: #7c4dab;
          font-size: 16px;
          font-weight: 800;
          font-family: 'Nunito', sans-serif;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 4px 20px rgba(0,0,0,0.15);
          margin-top: 8px;
        }
        .submit-btn:disabled { opacity: 0.35; cursor: not-allowed; }
        .submit-btn:not(:disabled):hover { transform: translateY(-2px); box-shadow: 0 6px 24px rgba(0,0,0,0.2); }
        .next-btn {
          padding: 14px 40px;
          border-radius: 50px;
          border: none;
          background: rgba(255,255,255,0.92);
          color: #7c4dab;
          font-size: 16px;
          font-weight: 800;
          font-family: 'Nunito', sans-serif;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 4px 20px rgba(0,0,0,0.2);
        }
        .next-btn:hover { transform: translateY(-2px) scale(1.03); }
      `}</style>

      <div style={{
        minHeight: "100vh",
        background: bg,
        transition: "background 0.8s ease",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px 20px",
        position: "relative",
        overflow: "hidden",
      }}>
        {floaters.map((f, i) => <FloatingPing key={i} style={f} emoji={f.emoji} />)}

        {/* 대기 화면 */}
        {step === "waiting" && (
          <div className="pop-in" style={{ textAlign: "center", zIndex: 1 }}>
            <div style={{ fontSize: "64px", marginBottom: "16px" }}>🔒</div>
            <h1 style={{ fontFamily: "'Gaegu', cursive", fontSize: "32px", color: "#fff", marginBottom: "8px", textShadow: "0 2px 12px rgba(0,0,0,0.2)" }}>
              두근두근 캐치! 충여핑
            </h1>
            <p style={{ color: "rgba(255,255,255,0.85)", fontSize: "15px", marginBottom: "6px" }}>
              퀴즈는 아직 열리지 않았어요
            </p>
            <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "13px", marginBottom: "16px" }}>
              오픈 시간: {OPEN_TIME.toLocaleString("ko-KR")}
            </p>
            <Countdown openTime={OPEN_TIME.getTime()} />
            <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "12px" }}>
              시간이 되면 자동으로 열려요 ✨
            </p>
          </div>
        )}

        {/* 퀴즈 화면 */}
        {step === "quiz" && (
          <div className="pop-in" style={{ width: "100%", maxWidth: "500px", zIndex: 1 }}>
            {/* 진행 표시 */}
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

            {/* 문제 카드 */}
            <div style={{
              background: "rgba(255,255,255,0.16)",
              backdropFilter: "blur(14px)",
              borderRadius: "24px",
              border: "1.5px solid rgba(255,255,255,0.38)",
              padding: "28px 24px",
            }}>
              <div style={{ textAlign: "center", marginBottom: "20px" }}>
                <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.75)", fontWeight: 700, letterSpacing: "0.06em", marginBottom: "4px" }}>
                  문제 {questionIdx + 1} / {QUESTIONS.length}
                </div>
                <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.6)", marginBottom: "14px" }}>
                  {q.bead} 획득 미션
                </div>
                <p style={{
                  fontFamily: "'Gaegu', cursive",
                  fontSize: "21px",
                  color: "#fff",
                  lineHeight: 1.55,
                  textShadow: "0 2px 8px rgba(0,0,0,0.15)",
                }}>
                  {q.question}
                </p>
              </div>

              {/* 보기 목록 */}
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "16px" }}>
                {q.options.map((opt, idx) => {
                  const optNum = idx + 1;
                  let cls = "option-btn";
                  if (showResult) {
                    if (optNum === q.answer) cls += " correct";
                    else if (optNum === selected && selected !== q.answer) cls += " wrong";
                  } else if (selected === optNum) {
                    cls += " selected";
                  }
                  return (
                    <button
                      key={idx}
                      className={cls}
                      onClick={() => handleSelect(optNum)}
                      disabled={showResult}
                    >
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

              <p style={{ textAlign: "center", marginTop: "14px", fontSize: "11px", color: "rgba(255,255,255,0.45)" }}>
                📜 {q.hint}
              </p>
            </div>
          </div>
        )}

        {/* 성공 화면 */}
        {step === "success" && (
          <div className="pop-in" style={{ width: "100%", maxWidth: "420px", textAlign: "center", zIndex: 1 }}>
            <div style={{ fontSize: "72px", marginBottom: "12px", display: "inline-block", animation: "floatPing 2s ease-in-out infinite" }}>🌟</div>
            <h2 style={{ fontFamily: "'Gaegu', cursive", fontSize: "36px", color: "#fff", marginBottom: "8px", textShadow: "0 2px 12px rgba(0,0,0,0.2)" }}>
              정답이에요!
            </h2>
            <p style={{ color: "rgba(255,255,255,0.9)", fontSize: "16px", marginBottom: "20px" }}>
              <strong>{q.bead}</strong>를 획득했어요 ✨
            </p>

            <div style={{
              background: "rgba(255,255,255,0.18)",
              backdropFilter: "blur(10px)",
              borderRadius: "20px",
              border: "1.5px solid rgba(255,255,255,0.4)",
              padding: "20px 24px",
              marginBottom: "24px",
            }}>
              <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "13px", marginBottom: "6px" }}>다음 미션 장소</p>
              <p style={{ fontFamily: "'Gaegu', cursive", fontSize: "22px", color: "#fff", fontWeight: 700 }}>
                📍 {q.nextLocation}
              </p>
            </div>

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
            <p style={{ color: "rgba(255,255,255,0.85)", fontSize: "15px", marginBottom: "4px" }}>
              혼란핑이 방해했나봐요...
            </p>
            <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "13px", marginBottom: "24px" }}>
              다시 도전하면 충여핑을 찾을 수 있어요! 💪
            </p>
            <button className="next-btn" onClick={handleRetry}>
              다시 도전하기 🔄
            </button>
          </div>
        )}

        {/* 완료 화면 */}
        {step === "complete" && (
          <div className="pop-in" style={{ width: "100%", maxWidth: "440px", textAlign: "center", zIndex: 1 }}>
            <div style={{ fontSize: "80px", marginBottom: "12px", display: "inline-block", animation: "floatPing 1.8s ease-in-out infinite" }}>👑</div>
            <h2 style={{ fontFamily: "'Gaegu', cursive", fontSize: "36px", color: "#fff", marginBottom: "8px", textShadow: "0 2px 16px rgba(0,0,0,0.2)" }}>
              모든 충여핑 수집 완료!
            </h2>
            <p style={{ color: "rgba(255,255,255,0.9)", fontSize: "16px", marginBottom: "20px" }}>
              공주님은 진정한 교칙 수호자예요 ✨
            </p>

            <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginBottom: "24px", flexWrap: "wrap" }}>
              {QUESTIONS.map((qItem) => (
                <div key={qItem.id} style={{
                  background: "rgba(255,255,255,0.22)",
                  borderRadius: "14px",
                  padding: "9px 14px",
                  border: "1.5px solid rgba(255,255,255,0.45)",
                  fontSize: "13px", color: "#fff", fontWeight: 700,
                }}>
                  {qItem.bead} ✓
                </div>
              ))}
            </div>

            <div style={{
              background: "rgba(255,255,255,0.18)",
              backdropFilter: "blur(10px)",
              borderRadius: "20px",
              border: "1.5px solid rgba(255,255,255,0.4)",
              padding: "20px 24px",
            }}>
              <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "13px", marginBottom: "6px" }}>선물 수령 장소</p>
              <p style={{ fontFamily: "'Gaegu', cursive", fontSize: "20px", color: "#fff", fontWeight: 700 }}>
                📍 {QUESTIONS[QUESTIONS.length - 1].nextLocation}
              </p>
            </div>
          </div>
        )}

        {/* 워터마크 */}
        {(step === "quiz" || step === "success" || step === "fail") && (
          <div style={{
            position: "fixed", bottom: "14px",
            fontFamily: "'Gaegu', cursive",
            fontSize: "13px", color: "rgba(255,255,255,0.4)",
            zIndex: 1, pointerEvents: "none",
          }}>
            두근두근 캐치! 충여핑 🌸
          </div>
        )}
      </div>
    </>
  );
}