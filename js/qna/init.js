const loadQnAArticles = async () => {
  const articles = document.getElementById("articles");
  
  const { data: datas, error } = await sb
    .from("questions")
    .select("*, profiles(*), answers(*)");
  if (error || !datas) {
    console.log("Supabase Error", error, data);
    return;
  }

  datas.forEach(async (data, _) => {
    const answerCount = data.answers.length;
    const nickname = data.profiles.nickname;
    const profileImgUrl = data.profiles.avatar_url;
    const content = data.content.length > 30 ? data.content.slice(30) + "..." : data.content;
    const title = data.title;
    const dateAgo = Math.floor((Date.now() - new Date(data.created_at)) / 3600000);
    const viewCount = await loadViewCountWithQnA(data.qid);
    const likeCount = await loadLikeCountWithQnA("../imgs/FullSmallHeart.png", "../imgs/EmptySmallHeart.png", data.qid);
    
    const articleHTML = `
      <article style="cursor: pointer;" onclick={window.location.href='/html/qna-detail.html?qid=${data.qid}'}>
        <div class="answer">
          <span style="color: ${answerCount <= 0 ? "#919BB1;" : "black;"}" >답변<br>${answerCount}</span>
        </div>
        <div class="img" style="background: url(${profileImgUrl});"></div>
        <div class="content">
          <span>${nickname} | 약 ${dateAgo}시간</span>
          <div class="title">
            <h6>${title}</h6>
            <div class="infos">
              <div>
                <img src="../imgs/View.png" alt="">
                <span>${viewCount}</span>
              </div>
              <div>
                <img src="../imgs/EmptySmallHeart.png" alt="">
                <span>${likeCount}</span>
              </div>
            </div>
          </div>
          <p>${content}</p>
        </div>
      </article>
      <hr>
    `;
    articles.innerHTML += articleHTML;
  })
}

document.addEventListener('DOMContentLoaded', () => {
  checkLoginStatus();
  loadQnAArticles();
  renderQuiz();
  loadSidebarRankings();
});
