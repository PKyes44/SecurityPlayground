// 뉴스 목록을 Supabase에서 불러와 메인 화면에 렌더링하는 기능
window.globalNewsData = [];

async function loadNewsFromSupabase() {
  console.log("Executed LoadNewsFromSupabase");

  const container = document.getElementById('news-container');
  if (!container) {
    console.log("Failed Load news-container");
    return; 
  }

  const { data, error } = await sb
    .from('news')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(20);

  if (error || !data) {
    container.innerHTML = '<p style="text-align:center; padding:20px;">뉴스를 가져오지 못했습니다.</p>';
    return;
  }

  window.globalNewsData = data;
  container.innerHTML = '';

  data.forEach((item, index) => {
    const imgUrl = item.img_url || 'https://via.placeholder.com/200x120?text=Security+News';
    const rawAuthor = item.author || '보안뉴스';
    const authorDisplay = rawAuthor.includes('기자') ? rawAuthor : `${rawAuthor} 기자`;
    const dateStr = item.created_at ? item.created_at.split('T')[0] : '';
    const headline = item.headline || '제목을 불러올 수 없습니다';
    const snippetSource = item.snippet || item.content || '';
    const snippet = snippetSource.length > 90 ? `${snippetSource.slice(0, 90)}...` : snippetSource;

    const html = `
      <article onclick="{window.location.href='/html/news-detail.html?nid=${item.nid}'}">
        <div class="img" style="background-image: url('${imgUrl}"></div>
        <div>
          <h6>${headline}</h6>
          <p>${snippet || ''}</p>
          <span>${authorDisplay} | ${dateStr}</span>
        </div>
      </article>

    `;
    container.insertAdjacentHTML('beforeend', html);
  });
}

// 뉴스 카드를 클릭했을 때 상세 내용을 모달로 보여주는 기능
function openNewsModal(index) {
  const data = window.globalNewsData[index];
if (!data) return;
  const modal = document.getElementById('news-modal');
  if (!modal) return;

  const img = document.getElementById('modal-img');
  const title = document.getElementById('modal-title');
  const date = document.getElementById('modal-date');
  const body = document.getElementById('modal-body');

  if (img) img.src = data.img_url || 'https://via.placeholder.com/700x300?text=Security+News';
  if (title) title.textContent = data.headline || '제목을 불러올 수 없습니다';
  if (date) date.textContent = data.created_at ? data.created_at.split('T')[0] : '';
  if (body) body.textContent = data.content || data.snippet || '내용이 없습니다.';

  modal.style.display = 'flex';
}

// 뉴스 모달을 닫는 기능
function closeNewsModal() {
  const modal = document.getElementById('news-modal');
  if (modal) modal.style.display = 'none';
}

// 모달 바깥 영역 클릭 시 모달을 닫도록 이벤트를 등록하는 기능
function attachNewsModalClose() {
  const modal = document.getElementById('news-modal');
  if (!modal) return;
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeNewsModal();
  });
}

// 전역에서 뉴스 관련 함수들에 접근할 수 있도록 바인딩
window.loadNewsFromSupabase = loadNewsFromSupabase;
window.openNewsModal = openNewsModal;
window.closeNewsModal = closeNewsModal;
window.attachNewsModalClose = attachNewsModalClose;
