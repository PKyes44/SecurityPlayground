// 로그인 페이지에서 인증 상태를 확인하고 회원가입 여부를 검사하는 초기화 함수
function initLoginPage() {
  checkRegisteredUser();
  sb.auth.onAuthStateChange((_event, session) => {
    if (!session) return;
    checkRegisteredUser();
  });
}

// DOM이 모두 로드된 이후 로그인 페이지 초기화 실행
document.addEventListener('DOMContentLoaded', initLoginPage);
