// js/follows-left.js

// 왼쪽 팔로잉 리스트 로딩
async function loadFollowingList() {
  // 1. 현재 로그인한 유저
  const { data: { user }, error: userError } = await sb.auth.getUser();
  if (userError || !user) {
    console.log('로그인 정보 없음', userError);
    return;
  }

  // 2. 내가 팔로우한 사람들(follows.uid = 내 uid)
  const { data, error } = await sb
    .from('follows')
    .select(`
      target_uid,
      profiles:target_uid (
        id,
        nickname,
        avatar_url
      )
    `)
    .eq('uid', user.id);

  if (error) {
    console.log('팔로잉 목록 조회 에러', error);
    return;
  }

  const listEl = document.querySelector('.following-list');
  if (!listEl) return;

  listEl.innerHTML = '';

  if (!data || data.length === 0) {
    listEl.innerHTML = '<li class="empty">팔로잉한 사람이 아직 없어요</li>';
    return;
  }

  data.forEach((row) => {
    const profile = row.profiles;
    const li = document.createElement('li');
    li.className = 'following-item';
    li.innerHTML = `
      <img src="${profile?.avatar_url || '/images/default-avatar.png'}"
           class="avatar" alt="">
      <span class="nickname">${profile?.nickname || '닉네임 없음'}</span>
    `;
    listEl.appendChild(li);
  });
}

// 페이지 로드시 실행
document.addEventListener('DOMContentLoaded', loadFollowingList);
