// 질문 데이터를 받아와 조회수/좋아요 순으로 정렬해 사이드바 순위 위젯을 렌더링하는 함수
async function loadSidebarRankings() {
  console.log("Executed loadSidebarRankings");
  const viewsContainer = document.getElementById('ranking-views');
  const likesContainer = document.getElementById('ranking-likes');

  const { data: allData, error } = await sb
    .from('questions')
    .select('*, profiles(id, avatar_url)')
    .limit(30);

  console.log(allData);

  if (error || !allData || allData.length === 0) {
    const emptyHtml = '<div style="padding:10px; text-align:center; color:#A0AEC0;">데이터가 없습니다.</div>';
    if (viewsContainer) viewsContainer.innerHTML = emptyHtml;
    if (likesContainer) likesContainer.innerHTML = emptyHtml;
    return;
  }

  const sortedByViews = [...allData]
    .sort((a, b) => (b.view_count || b.views || 0) - (a.view_count || a.views || 0))
    .slice(0, 3);

  const sortedByLikes = [...allData]
    .sort((a, b) => (b.likes_count || b.likes || 0) - (a.likes_count || a.likes || 0))
    .slice(0, 3);

  renderRanking(viewsContainer, sortedByViews, 'views');
  renderRanking(likesContainer, sortedByLikes, 'likes');
}

// 정렬된 데이터 리스트를 받아 순위 아이템 DOM을 생성해 사이드바에 출력하는 함수
function renderRanking(container, data, type) {
  console.log("Executed renderRanking");

  if (!container) return;
  container.innerHTML = '';

  data.forEach((item, index) => {
    const count = type === 'views' ? (item.view_count || item.views || 0) : (item.likes_count || item.likes || 0);
    const countLabel = type === 'views' ? '조회' : '좋아요';

    let iconStyle = '';
    if (index === 0) iconStyle = 'background:#FEEBC3; color:#D69E2E;';
    else if (index === 1) iconStyle = 'background:#E2E8F0; color:#4A5568;';
    else if (index === 2) iconStyle = 'background:#EDF2F7; color:#A0AEC0;';

    const categoryName = item.category || 'QnA';
    const title = item.title || '제목 없음';
    const avatarUrl = item.profiles.avatar_url;
    const contentImgUrl = item.image_url;
    const snippetSource = item.content || '';
    const snippet = snippetSource.length > 40 ? `${snippetSource.slice(0, 40)}...` : snippetSource;
    const qid = item.qid;

    const html = `
      <div class="content">
        <div class="img" style="${contentImgUrl ? `background-image: url(${contentImgUrl})`: ''}"></div>
        <div class="body">
          <div class="title">
            <div class="profile" style="${avatarUrl ? `background-image: url(${avatarUrl})`: ''}"></div>
            <span>${title}</span>
            <div>${categoryName}</div>
          </div>
          <span>${snippet}</span>
        </div>
      </div>
    `;
    // container.insertAdjacentHTML('beforeend', html);
    container.innerHTML += html;
  });
}

// 전역에서 사이드바 순위 위젯 관련 함수를 사용할 수 있도록 노출
window.loadSidebarRankings = loadSidebarRankings;
window.renderRanking = renderRanking;
