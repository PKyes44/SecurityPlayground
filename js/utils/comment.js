const renderComments = async (cmt) => {
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

    const answerBtnE = document.createElement("span");
    answerBtnE.className = "inactive";
    answerBtnE.innerText = "답장하기";
    liE.append(answerBtnE);

    answerBtnE.addEventListener("click", () => {
      const existingForm = liE.querySelector(".cmt-child-form");

      if (existingForm) {
        existingForm.remove();
        answerBtnE.className = "inactive";
        answerBtnE.innerText = "답장하기";
        return;
      }

      const formE = document.createElement("form");
      formE.className = "cmt-child-form";

      const inputE = document.createElement("input");
      inputE.className = "child-comment-input";
      inputE.placeholder = "답글을 입력하세요...";
      formE.append(inputE);

      const submitBtnE = document.createElement("button");
      submitBtnE.type = "submit";
      submitBtnE.innerText = "댓글 달기";
      formE.append(submitBtnE);

      formE.addEventListener("submit", (e) => insertChildComment(e, cmt));

      answerBtnE.insertAdjacentElement("afterend", formE);
      answerBtnE.className = "active";
      answerBtnE.innerText = "취소";
    });

    if (cmt.children.length <= 0) return liE;

    cmt.children.forEach(async (comment) => {
      const childCommentElement = await renderComments(comment);
      liE.append(childCommentElement);
    });

    return liE;
}

const insertChildComment = async (e, parentCmt) => {
  e.preventDefault();

  const { data: { user }, error: getUserError } = await sb.auth.getUser();
  if (getUserError || !user) return;

  const input = e.target.querySelector(".child-comment-input");
  const content = input.value.trim();
  if (!content) return;

  const insertData = {
    aid: parentCmt.aid,
    author: user.id,
    content,
    parent: parentCmt.cid,
    piority: 1
  };

  const { error: insertError } = await sb
    .from("comments")
    .insert(insertData);

  if (insertError) {
    console.error("Insert Error:", insertError);
    return;
  }

  window.location.reload();
};

const buildFamilyComments = (comments) => {
  const map = {};
  const roots = [];

  comments.forEach(cmt => map[cmt.cid] = { ...cmt, children: [] });
  comments.forEach(cmt => {
    if (cmt.parent) {
      if (map[cmt.parent]) map[cmt.parent].children.push(map[cmt.cid]);
    } else {
      roots.push(map[cmt.cid]);
    }
  });

  return roots;
}

const loadNormalComments = async () => {
  const commentListE = document.getElementById("comment-list");
  const params = new URLSearchParams(window.location.search);
  const aid = params.get("aid");

  const { data, error } = await sb
    .from("articles")
    .select("*, comments!comments_aid_fkey(*, profiles(nickname, avatar_url))")
    .eq('aid', aid)
    .single();

  if (error || !data) return console.log("Supabase Error", error, data);
  if (!data.comments) return;

  const comments = buildFamilyComments(data.comments);

  commentListE.innerHTML = "";

  comments.forEach(async (cmt) => {
    const commentElement = await renderComments(cmt);
    commentListE.append(commentElement);
  });
};

const loadCommentCount = async (paid) => {
  const params = new URLSearchParams(window.location.search);
  const aid = params.get("aid") || paid;

  const { count, error } = await sb
    .from("comments")
    .select("*", { count: "exact", head: true })
    .eq('aid', aid);
  if (error) {
    console.log("Supabase Error", error, count);
    return;
  }
  
  const commentCountE = document.getElementById("comment-cnt");
  if (commentCountE) commentCountE.innerText = `총 ${count ? count : 0}개의 댓글`;
  return count;
}

const bindUploadCommentEvent = async () => {
  const params = new URLSearchParams(window.location.search);
  const aid = params.get("aid");
  
  const commentFormE = document.getElementById("comment-form");
  commentFormE.addEventListener("submit", async (e) => {
    e.preventDefault();
    const { data: { user }, error: getUserError } = await sb.auth.getUser();
    if (getUserError || !user) return;
    
    const content = e.target.comment.value;
    const uid = user.id;

    const insertData = {
      aid,
      author: uid,
      content,
    };
    
    
    const { error: insertError } = await sb
    .from("comments")
    .insert(insertData)
    if (insertError) {
      console.error("Insert Error:", insertError);
      return;
    }
    window.location.reload();
  })
}

window.bindUploadCommentEvent = bindUploadCommentEvent;
window.loadCommentCount = loadCommentCount;
window.loadNormalComments = loadCommentCount;