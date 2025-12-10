const bindClickHeartEventWithArticle = async () => {
  const params = new URLSearchParams(window.location.search);
  const aid = params.get("aid");
  
  const { data: { user }, error: getUserError } = await sb.auth.getUser();
  if (getUserError || !user) return;
  const userId = user.id;
  
  const heartBtnE = document.getElementById("heart-button");
  if (await isLikedWithArticle()) {
    heartBtnE.addEventListener('click', async () => {
      const { error } = await sb
        .from('likes')
        .delete()
        .eq("aid", aid)
        .eq("uid", userId);
      if (error) {
        console.log("Supabase Heart Insert Error", error);
      }
      window.location.reload();
    });
    return;
  }

  heartBtnE.addEventListener('click', async () => {
    const { error } = await sb
      .from('likes')
      .insert({
        uid: userId,
        aid: aid,
      });
      if (error) {
        console.log("Supabase Heart Insert Error", error);
      }
      window.location.reload();
  });
}

const isLikedWithArticle = async (paid) => {
  const params = new URLSearchParams(window.location.search);
  const aid = params.get("aid") || paid;

  const { data: { user }, error: getUserError } = await sb.auth.getUser();
  if (getUserError || !user) return;
  const userId = user.id;

  const { count, error } = await sb
    .from("likes")
    .select("*", { head: true, count: "exact" })
    .eq("aid", aid)
    .eq("uid", userId)
  if (error) {
    console.log("Supabase Heart Count Error", error);
    return false;
  }
  return count > 0;
}

const bindClickHeartEventWithQnA = async () => {
  const params = new URLSearchParams(window.location.search);
  const qid = params.get("qid");
  const { data: { user }, error: getUserError } = await sb.auth.getUser();
  if (getUserError || !user) return;
  const userId = user.id;
  const heartBtnE = document.getElementById("heart-button");
  if (await isLikedWithQnA())  {
    heartBtnE.addEventListener('click', async () => {
      const { error } = await sb
        .from('likes')
        .delete()
        .eq("qid", qid)
        .eq("uid", userId);
      if (error) {
        console.log("Supabase Heart Insert Error", error);
      }
      window.location.reload();
    });
    return;
  }

  heartBtnE.addEventListener('click', async () => {
    const { error } = await sb
      .from('likes')
      .insert({
        uid: userId,
        qid,
      });
      if (error) {
        console.log("Supabase Heart Insert Error", error);
      }
      window.location.reload();
  });
}

const isLikedWithQnA = async (pqid) => {
  const params = new URLSearchParams(window.location.search);
  const qid = params.get("qid") || pqid;

  const { data: { user }, error: getUserError } = await sb.auth.getUser();
  if (getUserError || !user) return;
  const userId = user.id;

  const { count, error } = await sb
    .from("likes")
    .select("*", { head: true, count: "exact" })
    .eq("qid", qid)
    .eq("uid", userId);
  if (error) {
    console.log("Supabase Heart Count Error", error);
    return false;
  }

  return count > 0
}

const loadLikeCountWithArticle = async (fullhearturl, emptyhearturl, paid) => {
  const params = new URLSearchParams(window.location.search);
  const aid = params.get("aid") || paid;

  const heartCountE = document.getElementById("heart-count");
  const heartBtnE = document.getElementById("heart-button");
  if (heartBtnE) {
    if (await isLikedWithArticle(aid)) {
      heartBtnE.src = fullhearturl;
    } else {
      heartBtnE.src = emptyhearturl;
    }
  }
  const { count, error } = await sb
    .from("likes")
    .select("lid", { head: true, count: "exact" })
    .eq("aid", aid);
  if (error) {
    console.log('Supabase Count Error', error);
    return;
  }

  if (heartBtnE) heartCountE.innerText = count;
  return count;
}

const loadLikeCountWithQnA = async (fullhearturl, emptyhearturl, pqid) => {
  const params = new URLSearchParams(window.location.search);
  const qid = params.get("qid") || pqid;

  const likeCountE = document.getElementById("heart-count");
  const heartBtnE = document.getElementById("heart-button");

  if (heartBtnE) {
    if (await isLikedWithQnA(qid)) {
      heartBtnE.src = fullhearturl;   
    } else {
      heartBtnE.src = emptyhearturl;
    }
  }
  const { count, error } = await sb
    .from("likes")
    .select("lid", { head: true, count: "exact" })
    .eq("qid", qid);
  if (error) {
    console.log('Supabase Count Error', error);
    return;
  }

  if (likeCountE) likeCountE.innerText = count; 
  return count;
}

window.bindClickHeartEventWithArticle = bindClickHeartEventWithArticle
window.bindClickHeartEventWithQnA = bindClickHeartEventWithQnA;
window.isLikedWithArticle = isLikedWithArticle
window.isLikedWithQnA = isLikedWithQnA
window.loadLikeCountWithArticle = loadLikeCountWithArticle
window.loadLikeCountWithQnA = loadLikeCountWithQnA