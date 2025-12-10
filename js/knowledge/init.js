const loadKnowledgeArticles = async () => {
  const articles = document.getElementById("articles");
  const { data: dataList, error } = await sb
    .from('articles')
    .select("*, profiles(id, nickname, avatar_url)")
    .eq('type', "KNOWLEDGE");
  if (error || !dataList) {
    console.error("Supabase error:", error, dataList);
    return;
  }

  console.log(dataList);

  dataList.map(async (data, _) => {
    const title = data.title;
    const content = data.body;
    const nickname = data.profiles.nickname;
    const dateAgo = Math.floor((Date.now() - new Date(data.created_at)) / 3600000);
    
    const viewCount = await loadViewCountWithArticle(data.aid);
    const likeCount = await loadLikeCountWithArticle("../imgs/FullSmallHeart.png", "../imgs/EmptySmallHeart.png", data.aid);

    const articleHTML = `
      <article onclick="{window.location.href='/html/knowledge-detail.html?aid=${data.aid}'}">
          <div class="img">
            <img src="../imgs/KnowledgeBanner.png" alt="">
          </div>
          <div>
            <span class="info">${nickname} | ${dateAgo}시간</span>
            <h6>${title}</h6>
            <p>${content}</p>
            <div class="infos">
                <div>
                  <img src="../imgs/View.png" alt="">
                  <span id="view-count">${viewCount}</span>
                </div>
                <div>
                  <img src="../imgs/EmptySmallHeart.png" alt="">
                  <span id="heart-count">${likeCount}</span>
                </div>
              </div>
          </div>
      </article>
      <hr>
    `;
    articles.innerHTML += articleHTML;
  });
}

document.addEventListener('DOMContentLoaded', () => {
  checkLoginStatus();
  loadKnowledgeArticles();
  renderQuiz();
  loadSidebarRankings();
});
