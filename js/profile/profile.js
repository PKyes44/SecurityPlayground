// 프로필 페이지에서 선택된 아바타 파일을 관리
let selectedFile = null;

// 로그인한 유저의 프로필 정보를 불러와 화면에 초기 세팅하는 함수
async function loadProfile() {
  const { data: { user } } = await sb.auth.getUser();
  if (!user) {
    alert('로그인이 필요합니다.');
    window.location.href = 'login.html';
    return;
  }

  const emailEl = document.getElementById('email');
  if (emailEl) emailEl.value = user.email || '';

  const { data, error } = await sb.from('profiles').select('*').eq('id', user.id).single();
  if (error) {
    console.error('DB 조회 오류:', error);
    return;
  }

  if (data) {
    const nicknameEl = document.getElementById('nickname');
    const introEl = document.getElementById('intro');
    const avatarEl = document.getElementById('avatarPreview');

    if (nicknameEl) nicknameEl.value = data.nickname || '';
    if (introEl) introEl.value = data.intro || '';

    if (avatarEl && data.avatar_url && data.avatar_url.startsWith('http')) {
      avatarEl.src = `${data.avatar_url}?t=${Date.now()}`;
    }
  }
}

// 입력값과 선택된 이미지 파일을 이용해 프로필 정보를 저장하는 함수
async function saveProfile() {
  const btn = document.getElementById('saveBtn');
  const nickname = document.getElementById('nickname')?.value || '';
  const intro = document.getElementById('intro')?.value || '';

  const { data: { user } } = await sb.auth.getUser();
  if (!user) {
    alert('로그인 정보를 확인할 수 없습니다.');
    return;
  }

  if (btn) {
    btn.disabled = true;
    btn.innerText = '저장중...';
  }

  try {
    let newAvatarUrl = null;

    // 선택된 아바타 이미지를 스토리지에 업로드하고 공개 URL 생성
    if (selectedFile) {
      const fileExt = selectedFile.name.split('.').pop() || 'png';
      const fileName = `${user.id}/avatar.${fileExt}`;
      const { error: uploadError } = await sb.storage
        .from('avatars')
        .upload(fileName, selectedFile, { upsert: true });
      if (uploadError) throw uploadError;

      const { data: publicData } = sb.storage.from('avatars').getPublicUrl(fileName);
      if (publicData?.publicUrl?.includes('undefined')) {
        throw new Error('아바타 URL 생성 실패');
      }
      newAvatarUrl = publicData?.publicUrl;
    }

    // profiles 테이블에 프로필 정보 upsert
    const updates = {
      id: user.id,
      email: user.email,
      nickname,
      intro,
      updated_at: new Date()
    };
    if (newAvatarUrl) updates.avatar_url = newAvatarUrl;

    const { error } = await sb.from('profiles').upsert(updates);
    if (error) throw error;

    alert('저장되었습니다!');
    const avatarEl = document.getElementById('avatarPreview');
    if (avatarEl && newAvatarUrl) avatarEl.src = `${newAvatarUrl}?t=${Date.now()}`;
    setTimeout(() => { window.location.href = 'home.html'; }, 1000);
  } catch (err) {
    console.error('저장 오류:', err);
    alert('저장 실패: ' + err.message);
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.innerText = '저장하기';
    }
  }
}

// 프로필 페이지의 파일 선택/저장 버튼 등에 이벤트를 바인딩하는 함수
function bindProfileEvents() {
  const fileInput = document.getElementById('fileInput');
  const saveBtn = document.getElementById('saveBtn');
  const avatarEl = document.getElementById('avatarPreview');

  if (fileInput) {
    fileInput.addEventListener('change', (e) => {
      const file = e.target.files?.[0];
      if (file) {
        selectedFile = file;
        if (avatarEl) avatarEl.src = URL.createObjectURL(file);
      }
    });
  }

  if (saveBtn) {
    saveBtn.addEventListener('click', saveProfile);
  }
}

// DOM 로드 후 프로필 데이터 로딩 및 이벤트 바인딩 실행
document.addEventListener('DOMContentLoaded', () => {
  loadProfile();
  bindProfileEvents();
});

// 전역에서 프로필 로드 함수를 사용할 수 있도록 노출
window.loadProfile = loadProfile;
