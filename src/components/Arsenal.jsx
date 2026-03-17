import { useEffect, useState } from 'react'
import { FolderGit2, Star, GitFork, Calendar } from 'lucide-react'

const LANGS = new Set(['python','javascript','js','typescript','ts','rust','go','c','cpp','c++','java','ruby','php','swift','kotlin','bash','shell','html','css','react','vue','svelte','lua','zig'])

export default function Arsenal({ data }) {
  const [stats,    setStats]   = useState(null)
  const [repos,    setRepos]   = useState(null)
  const [ghError,  setGhError] = useState(false)

  useEffect(() => {
    const gh = data.identity.github
    Promise.all([
      fetch(`https://api.github.com/users/${gh}`),
      fetch(`https://api.github.com/users/${gh}/repos?per_page=12&sort=updated`),
    ]).then(async ([ur, rr]) => {
      if (ur.ok) {
        const u = await ur.json()
        setStats({ repos: u.public_repos || 0, followers: u.followers || 0, following: u.following || 0 })
      }
      if (rr.ok) {
        setRepos(await rr.json())
      } else {
        setGhError(true)
      }
    }).catch(() => setGhError(true))
  }, [data.identity.github])

  const projects = data.projects || []

  return (
    <section id="arsenal">
      <div className="c-tl" /><div className="c-tr" /><div className="c-bl" /><div className="c-br" />
      <p className="sec-label">// PROJECTS</p>
      <h2 className="sec-title reveal" style={{ marginBottom: '24px' }}>ARSENAL</h2>

      {/* Static projects from data */}
      <div id="arsenal-grid" className="pgrid reveal">
        {projects.map((p, i) => {
          const lang = p.tags?.find(t => LANGS.has(t.toLowerCase())) || p.tags?.[0] || ''
          return (
            <a key={i} href={p.url} target="_blank" rel="noopener noreferrer" className="rcard" style={{ textDecoration: 'none' }}>
              <div className="rname" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FolderGit2 size={16} />
                {p.name}
              </div>
              <div className="rdesc">{p.desc || 'no description.'}</div>
              <div className="rmeta" style={{ marginTop: 'auto' }}>
                {p.badge && <span className="rlang">{p.badge}</span>}
                {p.tags?.map((t, j) => <span key={j} className="rlang" style={{ borderColor: 'rgba(0,255,136,.2)', color: 'var(--g)' }}>{t}</span>)}
              </div>
            </a>
          )
        })}

        {/* GitHub repos */}
        {repos && repos.map((r, i) => (
          <a key={'gh-' + i} href={r.html_url} target="_blank" rel="noopener noreferrer" className="rcard" style={{ textDecoration: 'none' }}>
            <div className="rname" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FolderGit2 size={16} />
              {r.name}
            </div>
            <div className="rdesc">{r.description || 'no description.'}</div>
            <div className="rmeta" style={{ marginTop: 'auto', alignItems: 'center' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Star size={12} /> {r.stargazers_count}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><GitFork size={12} /> {r.forks_count}</span>
              {r.updated_at && <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Calendar size={12} /> {new Date(r.updated_at).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}</span>}
              {r.language && <span className="rlang" style={{ marginLeft: 'auto' }}>{r.language}</span>}
            </div>
          </a>
        ))}

        {ghError && (
          <div style={{ color: 'var(--muted)', fontSize: '.75em', padding: 16, lineHeight: 1.8 }}>
            [!] <span style={{ color: 'var(--r)' }}>github api unavailable</span><br />
            <a href={`https://github.com/${data.identity.github}`} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--c)', textDecoration: 'none' }}>
              → github.com/{data.identity.github}
            </a>
          </div>
        )}
      </div>
    </section>
  )
}
