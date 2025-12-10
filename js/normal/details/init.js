const formatDate = (date) => {
  const d = new Date(date);

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');

  return `${year}년 ${month}월 ${day}일`;
}


const loadNormalArtDetails = async () => {
  const params = new URLSearchParams(window.location.search);
  const aid = params.get("aid");

  const { data, error } = await sb
    .from("articles")
    .select("*, profiles(*)")
    .eq("aid", aid)
    .single();
  if (error || !data) {
    console.log("Supabase Error:", error, data);
    return;
  }

  console.log(data);

  const title = data.title;
  const body = data.body;
  const date = formatDate(data.created_at);
  const dateAgo = Math.floor((Date.now() - new Date(data.created_at)) / 3600000);
  const nickname = data.profiles.nickname;

  const dateE = document.getElementById('date');
  const titleE = document.getElementById("title");
  const nicknameE = document.getElementById('nickname');
  const dateAgoE = document.getElementById("date-ago");
  const bodyE = document.getElementById("body");

  titleE.innerText = title;
  bodyE.innerText = body;
  dateE.innerText = date;
  dateAgoE.innerText = dateAgo + "시간 전";
  nicknameE.innerText = nickname;
}


document.addEventListener('DOMContentLoaded', () => {
  checkLoginStatus();
  loadNormalArtDetails();
  loadNormalComments();
  loadCommentCount();
  renderQuiz();
  loadSidebarRankings();
  bindUploadCommentEvent();
  loadViewCountWithArticle();
  addViewCountWithArticle();
  bindClickHeartEventWithArticle();
  loadLikeCountWithArticle("../imgs/FullSmallHeart.png", "../imgs/EmptySmallHeart.png");
});
