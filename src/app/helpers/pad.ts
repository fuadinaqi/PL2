export default function pad(n: number) {
  const num = String(n)
  const p = '0000'
  const ans = p.substring(0, p.length - num.length) + num

  return ans
}
