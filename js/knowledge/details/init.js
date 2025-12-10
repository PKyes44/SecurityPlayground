const formatDate = (date) => {
  const d = new Date(date);

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');

  return `${year}년 ${month}월 ${day}일`;
}

const loadKnowledgeArtDetails = async () => {
  const params = new URLSearchParams(window.location.search);
  const aid = params.get("aid");

  const { data, error } = await sb
    .from('articles')
    .select("*")
    .eq('aid', aid)
    .single();
  if (error) {
    console.error("Supabase error:", error);
    return;
  }
  
  const bannerUrl = "../imgs/news-banner.png";
  const title = data.title + '<span class="type">지식</span>';
  const date = formatDate(data.created_at);
  const body = data.body;

  const imgE = document.getElementById('banner-img');
  const headlineE = document.getElementById('title');
  const dateE = document.getElementById('date');
  const bodyE = document.getElementById('content');

  imgE.src = bannerUrl;
  headlineE.innerHTML = title || '제목이 없습니다';
  dateE.innerText = date || '알수없음';
  bodyE.innerHTML = body || '내용이 없습니다';
}

const loadAuthorData = async () => {
  const params = new URLSearchParams(window.location.search);
  const aid = params.get("aid");

  const { data, error } = await sb
    .from("articles")
    .select(`
      *, 
      profiles:author (
        id, avatar_url, intro, nickname,
        follower_count:follows!follows_target_uid_fkey(count),
        following_count:follows!follows_uid_fkey(count)
      )
    `)
    .eq('aid', aid) 
    .single();
  if (error) {
    console.error("Supabase error:", error);
    return;
  }
  const followerCntE = document.getElementById('follower-cnt');
  const followingCntE = document.getElementById('following-cnt');
  const introE = document.getElementById('intro-body');
  const nicknameE = document.getElementById("nickname");
  const profileImgE = document.getElementById("profile-img");

  const followerCnt = data.profiles.follower_count[0].count;
  const followingCnt = data.profiles.following_count[0].count;
  const nickname = data.profiles.nickname;
  const intro = data.profiles.intro;
  const profileImgUrl = data.profiles.avatar_url;

  followerCntE.innerText = followerCnt;
  followingCntE.innerText = followingCnt;
  nicknameE.innerText = nickname;
  introE.innerText = intro;
  profileImgE.src = profileImgUrl;
  if (profileImgUrl) profileImgE.style.backgroundColor = "transparent";
}

const bindFollowEvent = async () => {
  const params = new URLSearchParams(window.location.search);
  const aid = params.get("aid");
  const {data, error} = await sb
    .from('articles')
    .select("author")
    .eq("aid", aid)
    .single();
  if (error || !data) {
    console.log("Supabase Error", error, data);
    return;
  }
  const authorId = data.author;

  const followBtnE = document.getElementById("follow-button");
  const { data: { user }, error: getUserError } = await sb.auth.getUser();
  if (getUserError || !user) return;
  const isFollowing = isFollowed(user.id, authorId);
  if (isFollowing) {
    followBtnE.style.display = "none";
    return;
  }

  followBtnE.addEventListener('click', async () => {
    const { error } = await sb
      .from("follows")
      .insert({
        uid: user.id,
        target_uid: authorId,
      });
    if (error) {
      console.log("Supabase Insert Error", error);
    }
  })
}

const isFollowed = async (uid, targetUid) => {
  const { count, error } = await sb
    .from("follows")
    .select("fid", { head: true, count: "exact" })
    .eq("uid", uid)
    .eq("target_uid", targetUid);

  if (error) {
    console.log("SupabaseError", error);
    return false;
  }

  return count > 0;
};
 
document.addEventListener('DOMContentLoaded', () => {
  checkLoginStatus();
  loadKnowledgeArtDetails();
  loadAuthorData();
  bindFollowEvent();
  addViewCountWithArticle();
  bindClickHeartEventWithArticle();
  loadLikeCountWithArticle("../imgs/FullHeart.png", "../imgs/EmptyHeart.png");
});
