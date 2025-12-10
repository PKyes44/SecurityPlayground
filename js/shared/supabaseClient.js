// 모든 페이지에서 공통으로 사용할 Supabase 클라이언트를 설정하는 코드
const SUPABASE_URL = 'https://lzerbvsbvovnnbmfubbt.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6ZXJidnNidm92bm5ibWZ1YmJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQwMzgzNDgsImV4cCI6MjA3OTYxNDM0OH0.dAJRyaxn0AXqUAo5u3NQC7-4diixWGw4w3jFOMEIhx4';

// 전역 window.sb에 Supabase 클라이언트를 노출하여 모든 스크립트에서 재사용
window.sb = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
