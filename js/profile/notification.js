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
      console.log("🔔 실시간 알림:", noti);
      alert("실시간 알림")
      handleNotification(noti);
    }
  )
  .subscribe();

function handleNotification(noti) {
  const box = document.getElementById("notification-box");

  const div = document.createElement("div");
  div.className = "noti-item";

  let message = "";

  if (noti.type === "like") {
    message = "누군가 회원님의 게시물을 좋아했습니다.";
  } else if (noti.type === "comment") {
    message = "새 댓글이 달렸습니다.";
  } else if (noti.type === "reply") {
    message = "댓글에 새 답글이 달렸습니다.";
  }

  div.innerText = message;
  box.prepend(div);
}
