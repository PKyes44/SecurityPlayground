const { data: { user } } = await sb.auth.getUser();
const myId = user.id;

// notifications 테이블 실시간 구독
sb
  .channel("notifications")
  .on(
    "postgres_changes",
    {
      event: "INSERT",
      schema: "public",
      table: "notifications",
      filter: `receiver=eq.${myId}`
    },
    ({ new: noti }) => {
      handleNotification(noti);
    }
  )
  .subscribe();

function handleNotification(noti) {
  const modal = document.getElementById("notification-modal");
  const modalText = document.getElementById("noti-modal-text");

  let message = "";

  if (noti.type === "like") {
    message = "누군가 회원님의 게시물을 좋아했습니다.";
  } 
  else if (noti.type === "comment") {
    message = "새 댓글이 달렸습니다.";
  } 
  else if (noti.type === "reply") {
    message = "댓글에 새 답글이 달렸습니다.";
  }

  modalText.innerText = message;

  // 모달 보여주기
  modal.classList.add("show");

  // 3초 뒤 사라짐
  setTimeout(() => {
    modal.classList.remove("show");
  }, 3000);
}

const bell = document.querySelector("#alarm-button");
const notiListModal = document.getElementById("notification-list-modal");
const notiListBox = document.getElementById("noti-list");
const closeBtn = document.getElementById("close-noti-list");

let unreadNotis = []; // 모달에 표시된 알림들 (나중에 is_read 처리)

bell.addEventListener("click", async () => {
  // 알림 불러오기 (읽지 않은 알림만)
  const { data, error } = await sb
    .from("notifications")
    .select("*")
    .eq("receiver", myId)
    .eq("is_read", false)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("알림 조회 실패:", error);
    return;
  }

  unreadNotis = data;
  notiListBox.innerHTML = "";

  if (data.length === 0) {
    notiListBox.innerHTML = "<div class='noti-item'>새로운 알림이 없습니다.</div>";
  } else {
data.forEach(noti => {
  const div = document.createElement("div");
  div.classList.add("noti-item");

  let message = "";
  if (noti.type === "like") message = "회원님의 게시물을 누군가 좋아했습니다.";
  else if (noti.type === "comment") message = "새 댓글이 달렸습니다.";
  else if (noti.type === "reply") message = "댓글에 새 답글이 달렸습니다.";

  div.innerText = message;

div.addEventListener("click", () => {
  if (noti.aid) {
    goToArticleDetail(noti.aid);  // 🔥 게시물 타입에 따른 이동
    notiListModal.classList.add("hidden");
  }
});


  notiListBox.appendChild(div);
});

  }

  // 모달 열기
  notiListModal.classList.remove("hidden");
});

closeBtn.addEventListener("click", async () => {
  notiListModal.classList.add("hidden");

  // 모달에 표시된 알림들을 읽음 처리
  if (unreadNotis.length > 0) {
    const ids = unreadNotis.map(n => n.nid);

    const { error } = await sb
      .from("notifications")
      .update({ is_read: true })
      .in("nid", ids);

    if (error) console.error("읽음 처리 실패:", error);
  }
});



async function goToArticleDetail(aid) {
  const { data, error } = await sb
    .from("articles")
    .select("type")
    .eq("aid", aid)
    .single();

  if (error || !data) {
    console.error("게시글 타입 조회 실패:", error);
    return;
  }

  const type = data.type;

  // 타입에 따라 이동 경로 분기
  if (type === "NORMAL") {
    window.location.href = `/html/normal-detail.html?aid=${aid}`;
  } 
  else if (type === "QNA") {
    window.location.href = `/html/qna-detail.html?aid=${aid}`;
  } 
  else if (type === "KNOWLEDGE") {
    window.location.href = `/html/knowledge-detail.html?aid=${aid}`;
  } 
  else {
    console.warn("알 수 없는 게시글 타입:", type);
  }
}
