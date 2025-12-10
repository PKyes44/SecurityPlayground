// 메인 페이지에서 검색 아이콘/입력창에 이벤트를 연결하는 함수
function bindSearchEvents() {
  const searchIcon = document.getElementById('main-search-icon');
  const searchInput = document.getElementById('main-search-input');
  if (searchIcon) searchIcon.addEventListener('click', performSearch);
  if (searchInput) {
    searchInput.addEventListener('keypress', (event) => {
      if (event.key === 'Enter') performSearch();
    });
  }
}

// 메인 페이지 로딩 완료 후 로그인 상태 체크, 뉴스/퀴즈/랭킹/검색/모달 등 초기 UI를 세팅
document.addEventListener('DOMContentLoaded', () => {
  checkLoginStatus();
typeof loadNewsFromSupabase === "function" && loadNewsFromSupabase();
  renderQuiz();
  loadSidebarRankings();
});
