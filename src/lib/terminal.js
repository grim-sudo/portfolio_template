// Terminal — accepts (tbodyEl, inputEl, sectionEl, data), returns cleanup fn
export function initTerminal(body, input, section, data) {
  if (!body || !input) return () => {}
  let hist = [], hi = -1

  function addL(text, cls) {
    const d = document.createElement('div')
    d.className = 'tl ' + (cls || '')
    d.textContent = text || '\u00a0'
    body.appendChild(d)
    body.scrollTop = body.scrollHeight
  }
  function typeAsync(lines) {
    lines.forEach(l => setTimeout(() => addL(l.t, l.c), l.d))
    return null
  }

  const cmds = {
    help: () => [
      { t: 'available commands:', c: 'ti' }, { t: '', c: '' },
      { t: '  whoami           — operator profile', c: 'to' },
      { t: '  skills           — capability matrix', c: 'to' },
      { t: '  projects         — project manifest', c: 'to' },
      { t: '  status           — system status report', c: 'to' },
      { t: '  socials          — contact/social links', c: 'to' },
      { t: '  github           — open github profile', c: 'to' },
      { t: '  scan-network     — run nmap scan', c: 'to' },
      { t: '  launch-recon     — osint recon operation', c: 'to' },
      { t: '  sudo access-root — privilege escalation', c: 'to' },
      { t: '  clear            — clear terminal', c: 'to' },
      { t: '', c: '' },
    ],
    whoami: () => [
      { t: '', c: '' },
      { t: '  ██████╗ ██████╗ ██╗ ███╗   ███╗', c: 'ts' },
      { t: '  ██╔════╝██╔══██╗██║████╗ ████║', c: 'ts' },
      { t: '  ██║  ███╗██████╔╝██║██╔████╔██║', c: 'ts' },
      { t: '  ██║   ██║██╔══██╗██║ ██║╚██╔╝██║', c: 'ts' },
      { t: '  ╚██████╔╝██║  ██║██║██║ ╚═╝ ██║', c: 'ts' },
      { t: '   ╚═════╝ ╚═╝  ╚═╝╚═╝╚═╝     ╚═╝', c: 'ts' },
      { t: '', c: '' },
      { t: `  UID:      ${data.identity.github}`, c: 'to' },
      { t: '  ROLE:     Pentester | Systems Developer | DevOps', c: 'to' },
      { t: '  PLATFORM: Arch / Kali / Debian', c: 'ti' },
      { t: '  TOOLSET:  BlackArch / Metasploit / Burp Suite', c: 'ti' },
      { t: '  SHELL:    zsh / bash', c: 'to' },
      { t: '  KERNEL:   6.6.30-arch1', c: 'to' },
      { t: '  GROUPS:   sudo, docker, pentest, dev, wheel', c: 'to' },
      { t: '', c: '' },
    ],
    skills: () => {
      const lines = [{ t: '> LOADING capability_matrix.db...', c: 'ti' }, { t: '', c: '' }]
      data.skills.forEach(cat => {
        const tag = cat.type === 'red' ? '[SEC]' : '[' + cat.category.slice(0, 3).toUpperCase() + ']'
        const names = cat.items.map(s => s.name).join('  ·  ')
        lines.push({ t: `  ${tag.padEnd(8)} ${names}`, c: cat.type === 'red' ? 'te' : 'to' })
      })
      lines.push({ t: '', c: '' })
      return lines
    },
    projects: () => {
      const lines = [{ t: '> RETRIEVING project_manifest.dat...', c: 'ti' }, { t: '', c: '' }]
      data.projects.forEach((p, i) => {
        lines.push({ t: `  [${String(i + 1).padStart(3, '0')}] ${p.name.padEnd(30)} [${p.badge.toUpperCase()}]`, c: 'to' })
      })
      lines.push({ t: '', c: '' }, { t: `  → github.com/${data.identity.github}`, c: 'ts' }, { t: '', c: '' })
      return lines
    },
    socials: () => {
      const lines = [{ t: '> LOADING social_links.conf...', c: 'ti' }, { t: '', c: '' }]
      data.socials.forEach(s => {
        lines.push({ t: `  [${s.platform.toUpperCase().padEnd(8)}] ${s.url}`, c: 'to' })
      })
      lines.push({ t: '', c: '' })
      return lines
    },
    status: () => {
      const t = new Date().toISOString()
      return [
        { t: '> SYSTEM STATUS REPORT', c: 'ti' }, { t: '', c: '' },
        { t: `  TIMESTAMP:  ${t}`, c: 'to' },
        { t: '  CPU:        ██████░░░░  62% [6-core 5.2GHz]', c: 'ts' },
        { t: '  MEMORY:     ████░░░░░░  38% [32GB DDR5]', c: 'ts' },
        { t: '  NETWORK:    ACTIVE // TLS 1.3 ENCRYPTED', c: 'ts' },
        { t: '  FIREWALL:   ENABLED // 247 RULES ACTIVE', c: 'ts' },
        { t: '  VPN:        CONNECTED // Switzerland', c: 'ts' },
        { t: '  INTRUSION:  NO THREATS DETECTED', c: 'ts' },
        { t: '', c: '' },
      ]
    },
    github: () => {
      window.open('https://github.com/' + data.identity.github, '_blank')
      return [{ t: `> Opening github.com/${data.identity.github}...`, c: 'ti' }]
    },
    clear: () => { body.innerHTML = ''; return [] },
    'scan-network': () => typeAsync([
      { t: '> Initializing network scan...', c: 'ti', d: 0 },
      { t: '> TARGET: 192.168.1.0/24', c: 'to', d: 280 },
      { t: '> SCAN TYPE: SYN stealth (-sS)', c: 'to', d: 520 },
      { t: '', c: '', d: 760 },
      { t: '  Scanning... ████████████████████ 100%', c: 'to', d: 1080 },
      { t: '', c: '', d: 1380 },
      { t: '  HOST: 192.168.1.1    [UP]  OPEN: 22, 80, 443', c: 'ts', d: 1660 },
      { t: '  HOST: 192.168.1.10   [UP]  OPEN: 22, 3306', c: 'ts', d: 1940 },
      { t: '  HOST: 192.168.1.25   [UP]  OPEN: 8080, 9090', c: 'ts', d: 2220 },
      { t: '  HOST: 192.168.1.50   [UP]  OPEN: 22, 80', c: 'ts', d: 2500 },
      { t: '', c: '', d: 2750 },
      { t: '  [!] Port 22 open on multiple hosts — ATTACK SURFACE', c: 'te', d: 2960 },
      { t: '  Scan complete. 4 hosts up. 14 open ports.', c: 'ti', d: 3200 },
      { t: '', c: '', d: 3450 },
    ]),
    'launch-recon': () => typeAsync([
      { t: '> Launching OSINT reconnaissance...', c: 'ti', d: 0 },
      { t: '', c: '', d: 320 },
      { t: '  [DNS]    Resolving targets...      ✔ DONE', c: 'ts', d: 680 },
      { t: '  [WHOIS]  Gathering domain data...  ✔ DONE', c: 'ts', d: 1080 },
      { t: '  [SHODAN] Querying indexed hosts...  ✔ DONE', c: 'ts', d: 1480 },
      { t: '  [NMAP]   Port enumeration...       ✔ DONE', c: 'ts', d: 1880 },
      { t: '  [NSE]    Script scan...            ✔ DONE', c: 'ts', d: 2280 },
      { t: '', c: '', d: 2580 },
      { t: '  FINDINGS: 3 potential CVEs identified', c: 'te', d: 2840 },
      { t: '  REPORT:   recon_classified.pdf generated', c: 'ti', d: 3100 },
      { t: '  STATUS:   Awaiting orders.', c: 'ts', d: 3360 },
      { t: '', c: '', d: 3620 },
    ]),
    'sudo access-root': () => typeAsync([
      { t: '[sudo] password for grim: ••••••••', c: 'to', d: 0 },
      { t: '', c: '', d: 720 },
      { t: '  Verifying credentials...', c: 'ti', d: 980 },
      { t: '  Escalating privileges...', c: 'ti', d: 1480 },
      { t: '', c: '', d: 1880 },
      { t: '  ████████████████████████████████████████', c: 'ts', d: 2080 },
      { t: '  PERMISSION GRANTED. WELCOME, ROOT.', c: 'ts', d: 2280 },
      { t: '  You now have full system access.', c: 'ts', d: 2480 },
      { t: '  ████████████████████████████████████████', c: 'ts', d: 2680 },
      { t: '', c: '', d: 2880 },
      { t: '  [!] ALL ACTIONS ARE LOGGED AND AUDITED.', c: 'te', d: 3080 },
      { t: '', c: '', d: 3330 },
    ]),
  }

  function run(cmd) {
    cmd = cmd.trim(); if (!cmd) return
    hist.unshift(cmd); hi = -1
    addL('grim@arch:~$ ' + cmd, 'tp')
    const fn = cmds[cmd]
    if (fn) { const r = fn(); if (Array.isArray(r)) r.forEach(l => addL(l.t, l.c)) }
    else { addL('bash: ' + cmd + ': command not found', 'te'); addL("Type 'help' for available commands.", 'to') }
    addL('', '')
  }

  function onKey(e) {
    if (e.key === 'Enter') { run(input.value); input.value = '' }
    else if (e.key === 'ArrowUp') { e.preventDefault(); if (hi < hist.length - 1) { hi++; input.value = hist[hi] } }
    else if (e.key === 'ArrowDown') { e.preventDefault(); hi > 0 ? (input.value = hist[--hi]) : (hi = -1, input.value = '') }
    else if (e.key === 'Tab') { e.preventDefault(); const v = input.value.toLowerCase(); const m = Object.keys(cmds).find(c => c.startsWith(v)); if (m) input.value = m }
  }

  function onSectionClick() { input.focus() }

  // Clear any content from StrictMode double-mount
  body.innerHTML = ''

  // Kali fastfetch boot
  const FASTFETCH = [
    { t: '', c: '' },
    { t: '       ,.....                            grim@kali', c: 'ts' },
    { t: '      ,,,,,,,,,,.                        ──────────────────────────────────────────', c: 'ts' },
    { t: '     ,,  ,,,,  ,,,                       OS       │ Kali GNU/Linux Rolling x86_64', c: 'ts' },
    { t: '    ,,  ,,,,  ,,,,  ,                    Kernel   │ 6.12.6-kali1-amd64', c: 'ts' },
    { t: '   ,,,  ,,,  ,,,,   ,,                   Shell    │ zsh 5.9', c: 'ts' },
    { t: '  ,,,,,,   ,,,,,   ,,,                   Uptime   │ 3d 14h 22m', c: 'ts' },
    { t: '    ,,,,,  ,,,,,   ,,,                   Packages │ 1337 (dpkg)', c: 'ts' },
    { t: '     ,,,,  ,,,,,                         WM       │ i3-wm', c: 'ts' },
    { t: '      ,,,  ,,,,,                         Terminal │ alacritty', c: 'ts' },
    { t: '       ,,  ,,,,,                         CPU      │ Intel Core i7-13700K @ 5.40GHz', c: 'ts' },
    { t: '        ,  ,,,,,                         Memory   │ 11.2 GiB / 32.0 GiB (35%)', c: 'ts' },
    { t: '           ,,,,,                         Disk     │ 89.3 GiB / 512 GiB (17%)', c: 'ts' },
    { t: '             ,,,', c: 'ts' },
    { t: '', c: '' },
    { t: "  Type 'help' for available commands.", c: 'ti' },
    { t: '', c: '' },
  ]
  FASTFETCH.forEach(l => addL(l.t, l.c))

  input.addEventListener('keydown', onKey)
  if (section) section.addEventListener('click', onSectionClick)

  return () => {
    input.removeEventListener('keydown', onKey)
    if (section) section.removeEventListener('click', onSectionClick)
  }
}
