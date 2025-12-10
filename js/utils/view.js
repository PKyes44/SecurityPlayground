const loadViewCountWithArticle = async (paid) => {
  const params = new URLSearchParams(window.location.search);
  const aid = params.get("aid") || paid;

  const viewCountE = document.getElementById("view-count");

  const { count, error } = await sb
    .from("views")
    .select("vid", { head: true, count: "exact" })
    .eq("aid", aid);

  console.log("viewcount: ", count);
  if (error) {
    console.log('Supabase View Count Error', error);
    return;
  }
  
  if (viewCountE) viewCountE.innerText = count;
  return count;
}
  
const addViewCountWithArticle = async () => {
  const params = new URLSearchParams(window.location.search);
  const aid = params.get("aid");

  const { data: { user }, error: getUserError } = await sb.auth.getUser();
  if (getUserError || !user) return;
  const userId = user.id;

  const { error } = await sb
    .from("views")
    .insert({
      aid,
      uid: userId,
    });
  if (error) {
    console.log("Supabase View Insert Error", error);
  }
}

const loadViewCountWithQnA = async (pqid) => {
  const params = new URLSearchParams(window.location.search);
  const qid = params.get("qid") || pqid;

  const viewCountE = document.getElementById("view-count");

  const { count, error } = await sb
    .from("views")
    .select("vid", { head: true, count: "exact" })
    .eq("qid", qid);
  if (error) {
    console.log('Supabase View Count Error', error);
    return;
  }
  if (viewCountE) viewCountE.innerText = count;
  return count;
}

const addViewCountWithQnA = async () => {
  const params = new URLSearchParams(window.location.search);
  const qid = params.get("qid");

  const { data: { user }, error: getUserError } = await sb.auth.getUser();
  if (getUserError || !user) return;
  const userId = user.id;

  const { error } = await sb
    .from("views")
    .insert({
      qid,
      uid: userId,
    });
  if (error) {
    console.log("Supabase View Insert Error", error);
  }
}

window.loadViewCountWithArticle = loadViewCountWithArticle
window.loadViewCountWithQnA = loadViewCountWithQnA
window.addViewCountWithArticle = addViewCountWithArticle
window.addViewCountWithQnA = addViewCountWithQnA