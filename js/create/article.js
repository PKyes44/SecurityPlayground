async function saveArticle() {
  // 1. 요소 값 수집
  const title = document.getElementById('title').value.trim();
  const body = document.getElementById('content').value.trim();
  const { data: { user }, error: getUserError } = await sb.auth.getUser();
  if (getUserError || !user) return;
  const author = user.id;

    // 2. 태그 ENUM 매핑
  const tagMap = {
    "자유": "NORMAL",
    "지식": "KNOWLEDGE",
    "QnA": "QNA"
  };
    const selectedTag = document.querySelector('.tag-wrapper ul li.active')?.innerText;
  const type = tagMap[selectedTag] || "NORMAL";


  // 2. 기본 검증
  if (!title || !body) {
    alert("제목과 본문을 입력해주세요.");
    return;
  }

  // 3. Supabase Insert
  const { data, error } = await sb
    .from('articles')
    .insert({
      author,
      title,
      body,
      type
    })
    .select();

  // 4. 결과 처리
  if (error) {
    console.error("❌ 게시물 저장 오류:", error);
    return;
  }

  // 예: 작성 후 상세 페이지 이동
  location.href = `/`;
}
const init = () => {
            document.querySelectorAll('.tag-wrapper ul li').forEach(li => {
            li.addEventListener('click', () => {
                document.querySelectorAll('.tag-wrapper ul li').forEach(x => x.classList.remove('active'));
                li.classList.add('active');
            });
        });
}

document.addEventListener('DOMContentLoaded', () => {
    init();
});
