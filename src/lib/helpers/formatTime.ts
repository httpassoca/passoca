export function msToTime(s:number) {
  function pad(n: number, z = 2) {
    return ('00' + n).slice(-z);
  }

  const ms = s % 1000;
  s = (s - ms) / 1000;
  const secs = s % 60;
  s = (s - secs) / 60;
  const mins = s % 60;

  return `${pad(mins)}:${pad(secs)}`;
}

