// ../js/mypage/qna.js

async function loadScrappedQuestions() {
  const { data: { user }, error: getUserError } = await sb.auth.getUser();
  if (getUserError || !user) return;

  // scraps 테이블에서 uid가 현재 사용자인 qid만 가져오기
  const { data: scraps, error } = await sb
    .from('scraps')
    .select('qid')
    .eq('uid', user.id)
    .not('qid', 'is', null); // qid가 null이 아닌 경우 (질문 스크랩)

  if (error) {
    console.error(error);
    return;
  }

  console.log(scraps, user.id);

  // 스크랩한 질문의 상세 내용 가져오기
  const qids = scraps.map(s => s.qid);
  if (qids.length === 0) return;

  const { data: questions, error: questionError } = await sb
    .from('questions')
    .select('*')
    .in('qid', qids);

  if (questionError) {
    console.error(questionError);
    return;
  }

  renderQuestions(questions);
}

// HTML에 질문 렌더링
function renderQuestions(questions) {
  const articleList = document.querySelector('.article-list');
  articleList.innerHTML = ''; // 기존 항목 삭제

  questions.forEach(q => {
    const li = document.createElement('li');

    const span = document.createElement('span');
    span.textContent = 'Q';
    li.appendChild(span);

    const p = document.createElement('p');
    p.textContent = q.title;
    li.appendChild(p);

    articleList.appendChild(li);
  });
}

// 페이지 로드 시 실행
document.addEventListener('DOMContentLoaded', loadScrappedQuestions);
