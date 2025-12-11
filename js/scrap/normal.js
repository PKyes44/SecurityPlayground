// ../js/mypage/normal.js

async function loadScrappedArticles() {
  const { data: { user }, error: getUserError } = await sb.auth.getUser();
  if (getUserError || !user) return;

  // scraps 테이블에서 uid가 현재 사용자인 aid만 가져오기
  const { data: scraps, error } = await sb
    .from('scraps')
    .select('aid')
    .eq('uid', user.id)
    .not('aid', 'is', null); // aid가 null이 아닌 경우 (자유 게시물 스크랩)

  if (error) {
    console.error(error);
    return;
  }

  const aids = scraps.map(s => s.aid);
  if (aids.length === 0) return;

  // articles 테이블에서 상세 내용 가져오기
  const { data: articles, error: articleError } = await sb
    .from('articles')
    .select('*')
    .eq("type", "NORMAL")
    .in('aid', aids);

  if (articleError) {
    console.error(articleError);
    return;
  }

  renderArticles(articles);
}

// HTML에 게시물 렌더링
function renderArticles(articles) {
  const articleList = document.querySelector('.article-list');
  articleList.innerHTML = ''; // 기존 항목 제거

  articles.forEach(a => {
    const li = document.createElement('li');

    const span = document.createElement('span');
    span.textContent = 'A'; // 자유 게시물 표시
    li.appendChild(span);

    const p = document.createElement('p');
    p.textContent = a.title; // 또는 a.content 등 원하는 필드
    li.appendChild(p);

    articleList.appendChild(li);
  });
}

// 페이지 로드 시 실행
document.addEventListener('DOMContentLoaded', loadScrappedArticles);
