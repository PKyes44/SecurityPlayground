async function loadKnowledgeArticles() {
  // 1. 로그인된 사용자 가져오기 (필요하면 author 기준 필터링 가능)
  const { data: userData } = await sb.auth.getUser();
  const user = userData?.user;
  const uid = user?.id;

  // 2. KNOWLEDGE 타입 글 가져오기
  const { data: articles, error } = await sb
    .from("articles")
    .select("aid, title, body, created_at")
    .eq("type", "NORMAL") // type이 KNOWLEDGE인 글만
    .eq("author", uid)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("❌ 글 가져오기 실패:", error);
    return;
  }

  // 3. ul.article-list 요소 선택
  const ul = document.querySelector("ul.article-list");
  if (!ul) return;

  // 4. 기존 글 초기화
  ul.innerHTML = "";

  // 5. 가져온 글을 li로 추가
  articles.forEach(article => {
    const li = document.createElement("li");

    // Q/A 표시 (임시로 'Q' 고정)
    const span = document.createElement("span");
    span.textContent = "Q"; 
    li.appendChild(span);

    const p = document.createElement("p");
    p.textContent = article.title; // 제목
    li.appendChild(p);

    ul.appendChild(li);
  });
}

// 페이지 로드 시 실행
document.addEventListener("DOMContentLoaded", loadKnowledgeArticles);
