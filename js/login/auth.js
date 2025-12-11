// 소셜 로그인 처리 함수
// - provider(google, kakao 등)를 인자로 받아 해당 소셜 로그인을 요청한다.
async function handleSocial(provider) {
  try {
    // Supabase OAuth 소셜 로그인 요청
    const { error } = await sb.auth.signInWithOAuth({
      provider, // 사용할 소셜 로그인 제공자 (예: 'google', 'kakao')
      options: {
        // 로그인 이후 돌아올 리다이렉트 URL (현재 도메인의 login.html로 이동)
        redirectTo: `${window.location.origin}/login.html`,
        // 소셜 로그인 시 추가로 전달할 쿼리 파라미터
        queryParams: {
          access_type: 'offline', // refresh token 발급을 위해 offline 접근 권한 요청
          prompt: 'consent'       // 매번 동의 화면을 띄우도록 설정
        }
      }
    });

    // 로그인 요청 중 오류가 발생한 경우 예외 처리
    if (error) throw error;
  } catch (error) {
    // 콘솔에 자세한 오류 출력
    console.error(`소셜 로그인 오류(${provider}):`, error.message);
    // 사용자에게 안내 메시지 표시
    alert('소셜 로그인 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.');
  }
}

// 소셜 로그인 후, 해당 유저가 이미 회원가입(추가 정보 입력)을 완료했는지 확인하는 함수
async function checkRegisteredUser() {
  // 현재 세션(로그인 정보) 가져오기
  const { data: { session } } = await sb.auth.getSession();

  // 세션이 없다면(로그인 되어 있지 않다면) 아무 작업도 하지 않음
  if (!session) return;

  // 세션에서 유저 정보 추출
  const user = session.user;

  // profiles 테이블에서 해당 유저의 프로필 정보 조회
  const { data, error } = await sb
    .from('profiles')
    .select('*')
    .eq('id', user.id)   // id 컬럼이 현재 로그인한 유저의 id와 같은 행 검색
    .maybeSingle();      // 0개 또는 1개의 결과만 기대할 때 사용

  // 프로필 조회 중 오류가 발생한 경우
  if (error) {
    console.error('프로필 조회 오류:', error);
    return;
  }

  // profiles 테이블에 해당 유저의 데이터가 없는 경우 (추가 정보 미입력 상태)
  if (!data) {
    alert('추가 정보가 필요합니다. 회원가입을 완료해주세요.');
    // 회원가입(추가 정보 입력) 페이지로 이동
    window.location.href = 'signup.html';
    return;
  }

  // profiles 테이블에 데이터가 존재하면(정상적으로 회원가입 완료된 유저)
  // 메인 페이지로 이동
  window.location.href = '/html/news.html';
}

// 전역(window)에서 함수에 접근할 수 있도록 바인딩
window.handleSocial = handleSocial;
window.checkRegisteredUser = checkRegisteredUser;
