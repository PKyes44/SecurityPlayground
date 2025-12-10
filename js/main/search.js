// 메인 페이지 검색 입력값을 읽어 질문 목록 페이지로 이동하는 함수
function performSearch() {
  const input = document.getElementById('main-search-input');
  if (!input) return;
  const keyword = input.value.trim();
  if (keyword) {
    const encoded = encodeURIComponent(keyword);
    window.location.href = `questions.html?search=${encoded}`;
  } else {
    alert('검색어를 입력해주세요.');
  }
}

// 전역에서 검색 함수 호출 가능하도록 노출
window.performSearch = performSearch;
