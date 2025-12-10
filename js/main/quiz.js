// 퀴즈 데이터 및 점수/진행 상태 관리
const quizData = [
  { question: "1. 크로스 사이트 스크립트 공격은?", options: ["DDoS", "XSS", "SQL Injection", "Brute Force", "Phishing"], answer: 1 },
  { question: "2. 데이터베이스를 조작하는 공격 기법은?", options: ["Trojan", "Ransomware", "SQL Injection", "Worm", "Spyware"], answer: 2 },
  { question: "3. '절대 믿지 말고 검증하라'는 보안 모델은?", options: ["VPN", "Firewall", "Zero Trust", "Sandboxing", "DMZ"], answer: 2 },
  { question: "4. 파일을 암호화하고 돈을 요구하는 악성코드는?", options: ["Adware", "Ransomware", "Keylogger", "Rootkit", "Botnet"], answer: 1 },
  { question: "5. 사용자의 비밀번호를 무작위로 추측해 침투하는 공격은?", options: ["Rainbow Table", "Dictionary Attack", "Brute Force", "MITM", "Spoofing"], answer: 2 },
  { question: "6. 서버나 과도한 트래픽을 보내 마비시키는 공격은?", options: ["DDoS", "APT", "Social Engineering", "Exploit", "Session Hijacking"], answer: 0 },
  { question: "7. 설문·심리를 이용해 정보를 빼내는 기법은?", options: ["Fuzzing", "Sniffing", "Social Engineering", "Zero-day", "Buffer Overflow"], answer: 2 },
  { question: "8. 2가지 이상 인증 수단을 사용하는 방식은?", options: ["SSO", "MFA", "OAuth", "OTP", "Biometrics"], answer: 1 },
  { question: "9. 인터넷 상에서 안전하게 연결을 제공하는 기술은?", options: ["DNS", "DHCP", "VPN", "FTP", "HTTP"], answer: 2 },
  { question: "10. 검사되지 않은 트래픽을 차단해 보안 유지하는 장치는?", options: ["Switch", "Router", "Firewall", "Hub", "Gateway"], answer: 2 }
];

let currentQuizIndex = 0;
let score = 0;

// 현재 퀴즈 문제/보기/진행도/다음 버튼 등을 화면에 렌더링하는 함수
function renderQuiz() {
  const questionEl = document.getElementById('quiz-question');
  const optionsEl = document.getElementById('quiz-options-container');
  const nextBtn = document.getElementById('btn-next-quiz');
  const feedbackEl = document.getElementById('quiz-feedback');
  const progressEl = document.getElementById('quiz-progress');

  if (!questionEl || !optionsEl || !nextBtn || !feedbackEl) return;

  feedbackEl.innerHTML = '';
  nextBtn.style.display = 'none';

  // 모든 퀴즈를 다 풀었을 때 결과와 다시하기 버튼 표시
  if (currentQuizIndex >= quizData.length) {
    questionEl.innerText = '모든 퀴즈를 완료했습니다!';
    optionsEl.innerHTML = `
      <div style="text-align:center; padding:10px;">
        <p>점수: ${score} / ${quizData.length}</p>
        <button onclick="location.reload()" style="margin-top:10px; padding:5px 10px; cursor:pointer;">처음부터 다시하기</button>
      </div>
    `;
    if (progressEl) progressEl.innerText = '';
    return;
  }

  // 현재 퀴즈 정보로 문제/보기/진행도 갱신
  const currentQuiz = quizData[currentQuizIndex];
  if (progressEl) progressEl.innerText = `${currentQuizIndex + 1} / ${quizData.length}`;
  questionEl.innerText = currentQuiz.question;

  optionsEl.innerHTML = '';
  currentQuiz.options.forEach((opt, idx) => {
    const btn = document.createElement('li');
    btn.className = 'quiz-option';
    btn.innerText = opt;
    btn.onclick = () => checkAnswer(idx, btn);
    optionsEl.appendChild(btn);
  });

  // 다음 문제로 넘어가는 버튼 동작
  nextBtn.onclick = () => {
    currentQuizIndex++;
    renderQuiz();
  };
}

// 사용자가 선택한 보기의 정답 여부를 확인하고 피드백/스타일을 처리하는 함수
function checkAnswer(selectedIdx, btnElement) {
  const currentQuiz = quizData[currentQuizIndex];
  const nextBtn = document.getElementById('btn-next-quiz');
  const feedbackEl = document.getElementById('quiz-feedback');
  const allOpts = document.querySelectorAll('.quiz-option');

  if (!nextBtn || !feedbackEl) return;
  // 이미 한 번 채점이 끝난 상태라면 재채점 방지
  if (nextBtn.style.display === 'block') return;

  if (selectedIdx === currentQuiz.answer) {
    btnElement.classList.add('correct');
    feedbackEl.innerHTML = '<span style="color:#22543D">정답입니다!</span>';
    score++;
  } else {
    btnElement.classList.add('wrong');
    feedbackEl.innerHTML = '<span style="color:#742A2A">오답입니다.</span>';
    if (allOpts[currentQuiz.answer]) allOpts[currentQuiz.answer].classList.add('correct');
  }
  nextBtn.style.display = 'block';
}

// 전역에서 퀴즈 렌더링 함수를 호출할 수 있도록 바인딩
window.renderQuiz = renderQuiz;
