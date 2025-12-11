async function updateProfile() {
  // 1. 요소에서 값 가져오기
  const nickname = document.getElementById('nickname').value.trim();
  const email = document.getElementById('email').value.trim();
  const intro = document.getElementById('intro').value.trim();

  // 2. 로그인된 사용자 UUID
  const { data: userData } = await sb.auth.getUser();
  const user = userData?.user;

  if (!user) {
    alert("로그인이 필요합니다!");
    return;
  }

  const uid = user.id;

  // 3. 유효성 검사
  if (nickname.length < 2) {
    alert("닉네임은 2글자 이상이어야 합니다.");
    return;
  }
  if (!email.includes("@")) {
    alert("올바른 이메일 주소를 입력해주세요.");
    return;
  }

  // 4. 토글 상태 가져오기
  const likeToggle = document.querySelector(".noti-settings div:nth-child(1) .toggle");
  const commentToggle = document.querySelector(".noti-settings div:nth-child(2) .toggle");
  const childCommentToggle = document.querySelector(".noti-settings div:nth-child(3) .toggle");

  const like_alarm = likeToggle.classList.contains("on");
  const comment_alarm = commentToggle.classList.contains("on");
  const child_comment_alarm = childCommentToggle.classList.contains("on");

  // 5. profiles 데이터 업데이트
  const { data, error } = await sb
    .from("profiles")
    .update({
      nickname,
      email,
      intro,
      like_alarm,
      comment_alarm,
      child_comment_alarm,
      updated_at: new Date().toISOString()
    })
    .eq("id", uid)
    .select();

  // 6. 처리 결과
  if (error) {
    console.error("❌ 프로필 업데이트 실패:", error);
    alert("프로필 저장 중 오류가 발생했습니다.");
    return;
  }

  console.log("✅ 프로필 업데이트 성공:", data);
  alert("프로필이 성공적으로 저장되었습니다!");
  windows.location.href = "/";
}

document.addEventListener("DOMContentLoaded", async () => {
  // 1. 토글 클릭 이벤트 설정
  const toggles = document.querySelectorAll(".toggle");
  toggles.forEach(toggle => {
    toggle.addEventListener("click", () => {
      toggle.classList.toggle("on");
      toggle.classList.toggle("off");
    });
  });

  // 2. 로그인된 사용자 정보 가져오기
  const { data: userData } = await sb.auth.getUser();
  const user = userData?.user;

  if (!user) return; // 로그인 안 되어 있으면 초기화 안 함

  const uid = user.id;

  // 3. 프로필 데이터 가져오기
  const { data: profile, error } = await sb
    .from("profiles")
    .select("nickname, email, intro, like_alarm, comment_alarm, child_comment_alarm")
    .eq("id", uid)
    .single();

  if (error) {
    console.error("❌ 프로필 불러오기 실패:", error);
    return;
  }

  // 4. 폼에 값 채우기
  document.getElementById("nickname").value = profile.nickname || "";
  document.getElementById("email").value = profile.email || "";
  document.getElementById("intro").value = profile.intro || "";

  // 5. 토글 상태 반영
  const [likeToggle, commentToggle, childCommentToggle] = toggles;
  likeToggle.classList.toggle("on", profile.like_alarm);
  likeToggle.classList.toggle("off", !profile.like_alarm);

  commentToggle.classList.toggle("on", profile.comment_alarm);
  commentToggle.classList.toggle("off", !profile.comment_alarm);

  childCommentToggle.classList.toggle("on", profile.child_comment_alarm);
  childCommentToggle.classList.toggle("off", !profile.child_comment_alarm);
});

// -----------------------------
// 저장 버튼 클릭 시 업데이트
// -----------------------------
async function updateProfile() {
  const nickname = document.getElementById('nickname').value.trim();
  const email = document.getElementById('email').value.trim();
  const intro = document.getElementById('intro').value.trim();

  const { data: userData } = await sb.auth.getUser();
  const user = userData?.user;
  if (!user) { alert("로그인이 필요합니다!"); return; }

  const uid = user.id;

  // 유효성 검사
  if (nickname.length < 2) { alert("닉네임은 2글자 이상이어야 합니다."); return; }
  if (!email.includes("@")) { alert("올바른 이메일 주소를 입력해주세요."); return; }

  // 토글 상태
  const toggles = document.querySelectorAll(".toggle");
  const like_alarm = toggles[0].classList.contains("on");
  const comment_alarm = toggles[1].classList.contains("on");
  const child_comment_alarm = toggles[2].classList.contains("on");

  // Supabase 업데이트
  const { data, error } = await sb
    .from("profiles")
    .update({ nickname, email, intro, like_alarm, comment_alarm, child_comment_alarm, updated_at: new Date().toISOString() })
    .eq("id", uid)
    .select();

  if (error) { console.error(error); alert("프로필 저장 중 오류가 발생했습니다."); return; }

  console.log("✅ 프로필 업데이트 성공:", data);
  alert("프로필이 성공적으로 저장되었습니다!");

  windows.location.href = "/";
}
