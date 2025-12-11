async function fetchNotifications() {
  const res = await fetch("/api/notifications");
  const notifications = await res.json();

  const wrap = document.getElementById("notification-list");
  wrap.innerHTML = "";

  notifications.forEach(n => {
    const item = document.createElement("div");
    item.className = "noti-item";
    item.innerText = `${n.headline} - ${n.content}`;
    wrap.appendChild(item);
  });
}

// 3초마다 알림 확인
setInterval(fetchNotifications, 3000);