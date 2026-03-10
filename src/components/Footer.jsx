export default function Footer({ data }) {
  const year = new Date().getFullYear()
  return (
    <footer>
      <div className="flogo">{data.identity.github.toUpperCase()}</div>
      <div className="finfo">© {year} &nbsp;·&nbsp; {data.identity.realname} &nbsp;·&nbsp; BUILT IN THE TERMINAL</div>
    </footer>
  )
}
