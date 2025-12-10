const renderAnswers = async (cmt) => {
  const { profiles, content, author } = cmt;
    const nickname = profiles.nickname;
    const profileImgUrl = profiles.avatar_url;
    const dateAgo = Math.floor((Date.now() - new Date(cmt.created_at)) / 3600000);

    const { data: { user }, error: getUserError } = await sb.auth.getUser();
    if (getUserError || !user) return;

    const liE = document.createElement("li");
    liE.className = "comment-item";
    liE.style.marginLeft = `${cmt.piority * 20}px`

    const authorE = document.createElement("div");
    authorE.className = "author";
    console.log(user.id, author);
    authorE.innerHTML = `
      <img src="${profileImgUrl}" class="profile">
      <div class="info">
        <span class="nickname">${nickname}</span>
        <time>${dateAgo}시간 전</time>
      </div>
      ${author == user.id ? '<img src="../imgs/others.png" class="others">' : ""}
    `;
    liE.append(authorE);

    const contentE = document.createElement("span");
    contentE.className = "content";
    contentE.innerText = content;
    liE.append(contentE);

    return liE;
}


const loadQnAAnswers = async () => {
  const commentListE = document.getElementById("comment-list");
  const params = new URLSearchParams(window.location.search);
  const qid = params.get("qid");

  const { data, error } = await sb
    .from("answers")
    .select("*, profiles(*)")
    .eq('qid', qid);

  if (error || !data) return console.log("Supabase Error", error, data);

  commentListE.innerHTML = "";

  data.forEach(async (cmt) => {
    const commentElement = await renderAnswers(cmt);
    console.log(commentElement);
    commentListE.append(commentElement);
  });
};

const loadAnswerCount = async () => {
  const params = new URLSearchParams(window.location.search);
  const qid = params.get("qid");

  const { count, error } = await sb
    .from("answers")
    .select("*", { count: "exact", head: true })
    .eq('qid', qid);
  if (error) {
    console.log("Supabase Error", error, count);
    return;
  }
  
  const commentCountE = document.getElementById("comment-cnt");
  commentCountE.innerText = `총 ${count ? count : 0}개의 답변`;
}

const bindUploadAnswerEvent = async () => {
  const params = new URLSearchParams(window.location.search);
  const qid = params.get("qid");
  
  const commentFormE = document.getElementById("comment-form");
  commentFormE.addEventListener("submit", async (e) => {
    e.preventDefault();
    const { data: { user }, error: getUserError } = await sb.auth.getUser();
    if (getUserError || !user) return;
    
    const content = e.target.comment.value;
    const uid = user.id;

    const insertData = {
      qid: qid,
      author: uid,
      content,
    };
    
    const { error: insertError } = await sb
    .from("answers")
    .insert(insertData)
    if (insertError) {
      console.error("Insert Error:", insertError);
      return;
    }
    window.location.reload();
  })
}

window.bindUploadAnswerEvent = bindUploadAnswerEvent;
window.loadQnAAnswers = loadQnAAnswers;
window.loadAnswerCount = loadAnswerCount;