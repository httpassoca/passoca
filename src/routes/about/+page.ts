export async function load() {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/now-playing`).then(
    (res) => res.json()
  ).catch((err) => {
    console.log(err);
  });
  if(!res) return {};
  let music = null;
  if (res.isPlaying) music = res.music;
  return { music };
}
