// 로그인 필요 안내 모달 열기
function showLoginModal() {
  const modal = document.getElementById('login-req-modal');
  if (modal) modal.style.display = 'flex';
}

// 로그인 필요 안내 모달 닫기
function closeLoginModal() {
  const modal = document.getElementById('login-req-modal');
  if (modal) modal.style.display = 'none';
}

// 메인 페이지에서 로그인 상태에 따라 UI 변경 및 로그아웃 처리
async function checkLoginStatus() {
  const { data: { session } } = await sb.auth.getSession();
  const loginBtn = document.getElementById('login-btn');
  const userProfile = document.getElementById('user-profile-area');

  if (session) {
    if (loginBtn) loginBtn.style.display = 'none';
    if (userProfile) {
      userProfile.style.display = 'flex';
      const user = session.user;
      const meta = user?.user_metadata || {};
      const name = meta.full_name || user.email?.split('@')[0] || '사용자';
      const nicknameEl = document.getElementById('my-nickname');
      const avatarEl = document.getElementById('my-avatar');

      if (nicknameEl) nicknameEl.innerText = name;
      if (avatarEl && meta.avatar_url) {
        avatarEl.src = meta.avatar_url;
      }
    }
  } else {
    if (loginBtn) loginBtn.style.display = 'block';
    if (userProfile) userProfile.style.display = 'none';
    showLoginModal();
  }

  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.onclick = async () => {
      await sb.auth.signOut();
      window.location.reload();
    };
  }
}

// 특정 기능 실행 전에 로그인 여부 검사 (미로그인 시 모달 표시)
async function requireLogin(callback) {
  const { data: { session } } = await sb.auth.getSession();
  if (session) callback();
  else showLoginModal();
}

// 로그인 페이지로 이동
function goToLogin() {
  window.location.href = 'login.html';
}

// 전역에서 접근할 수 있도록 함수 바인딩
window.showLoginModal = showLoginModal;
window.closeLoginModal = closeLoginModal;
window.checkLoginStatus = checkLoginStatus;
window.requireLogin = requireLogin;
window.goToLogin = goToLogin;
