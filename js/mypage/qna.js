async function loadQnAArticles() {
  // 1. 로그인된 사용자 정보 가져오기 (필요 시 author 기준 필터)
  const { data: userData } = await sb.auth.getUser();
  const user = userData?.user;
  const uid = user?.id;

  // 2. QNA 글 가져오기
  const { data: questions, error } = await sb
    .from("questions")
    .select("qid, title, content, created_at")
    .eq("author", uid)
    .order("created_at", { ascending: false }); // 최신 글 위로

  if (error) {
    console.error("❌ QNA 글 가져오기 실패:", error);
    return;
  }

  // 3. ul.article-list 요소 선택
  const ul = document.querySelector("ul.article-list");
  if (!ul) return;

  // 4. 기존 글 초기화
  ul.innerHTML = "";

  // 5. 글 추가
  questions.forEach(question => {
    const li = document.createElement("li");

    // Q 표시
    const span = document.createElement("span");
    span.textContent = "Q"; 
    li.appendChild(span);

    // 제목 표시
    const p = document.createElement("p");
    p.textContent = question.title;
    li.appendChild(p);

    ul.appendChild(li);
  });
}

// 페이지 로드 시 QNA 글 불러오기
document.addEventListener("DOMContentLoaded", loadQnAArticles);
