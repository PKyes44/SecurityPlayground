const loadNormalArticles = async () => {
  const articles = document.getElementById("articles");
  const { data: dataList, error } = await sb
    .from('articles')
    .select("*, profiles(id, nickname, avatar_url)")
    .eq('type', "NORMAL");
  if (error || !dataList) {
    console.error("Supabase error:", error, dataList);
    return;
  }

  console.log(dataList);

  dataList.map(async (data, _) => {
    const title = data.title;
    const content = data.body;
    const profileImgUrl = data.profiles.avatar_url;
    const commentCount = await loadCommentCount(data.aid);
    const viewCount = await loadViewCountWithArticle(data.aid);
    const likeCount = await loadLikeCountWithArticle("../imgs/FullSmallHeart.png", "../imgs/EmptySmallHeart.png", data.aid);
    const articleHTML = `
      <article onclick="{window.location.href='/html/normal-detail.html?aid=${data.aid}'}">
          <div class="img" style="background-image: url(${profileImgUrl}); background-size: contain;"></div>
          <div>
            <div class="title">
              <h6>${title}</h6>
              <div class="infos">
                <div>
                  <img src="../imgs/View.png" alt="">
                  <span id="view-count">${viewCount}</span>
                </div>
                <div>
                  <img src="../imgs/EmptySmallHeart.png" alt="">
                  <span id="heart-count">${likeCount}</span>
                </div>
                <div>
                  <img src="../imgs/Comment.png" alt="">
                  <span>${commentCount}</span>
                </div>
              </div>
            </div>
            <p>${content && (content.length > 30 ? content.slice(30) + "..." : content)}</p>
          </div>
      </article>
      <hr>
    `;
    articles.innerHTML += articleHTML;
  });
}

document.addEventListener('DOMContentLoaded', () => {
  checkLoginStatus();
  loadNormalArticles();
  renderQuiz();
  loadSidebarRankings();
});
