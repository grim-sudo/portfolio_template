// ═══════════════════════════════════════
// GRIM PORTFOLIO — data.js (ES module)
// ═══════════════════════════════════════

export const GRIM_DATA = {
  "identity": {
    "handle": "Grim",
    "realname": "Shefan Tharani",
    "role": "Systems Engineer // Security Researcher",
    "tagline": "I build hardened systems, break weak assumptions, and report what actually matters.",
    "rotatingRoles": [
      "Security Researcher",
      "CTF Player",
      "Exploit Builder",
      "Linux Systems Engineer",
      "Network Recon Operator"
    ],
    "github": "grim-sudo",
    "platform": "Arch / Kali / Debian",
    "toolset": "BlackArch · Metasploit · Burp Suite",
    "shell": "zsh / bash",
    "location": "CLASSIFIED",
    "clearance": "CLASSIFIED",
    "available": true
  },
  "mission": {
    "overview": "I engineer Linux-first infrastructure that stays up under pressure.\nI run offensive simulations to expose weak links before attackers do.\nI move between DevOps and adversarial testing without context switching.",
    "platforms": [
      "Arch Linux","Kali Linux","Debian","BlackArch","Ubuntu Server","Unix-like Systems"
    ],
    "focusAreas": [
      "Attack Surface Mapping",
      "OSINT & Target Profiling",
      "Network Recon + Enumeration",
      "Linux Internals & Kernel Work",
      "Red Team Labs / CTF Ops"
    ],
    "toolset": [
      "Metasploit","Burp Suite","Nmap","Docker","Kubernetes","Shodan",
      "Amass","IPGhost","Sherlock","Zsteg","SQLMap","Maltego",
      "TheHarvester","Gobuster","Nikto"
    ]
  },
  "boot": {
    "lines": [
      { "t": "[  0.000000] Linux kernel 6.6.30-arch1 detected", "c": "" },
      { "t": "[  0.001201] Arch system profile loaded", "c": "ok" },
      { "t": "[  0.082410] BlackArch toolkit mounted — 2900 tools ready", "c": "ok" },
      { "t": "[  0.213800] Kali pentest modules loaded", "c": "ok" },
      { "t": "[  0.881100] NET: Registered PF_INET6 protocol family", "c": "" }
    ],
    "accessMessage": "ACCESS GRANTED"
  },
  "network": {
    "nodes": [
      { "id": "inet",   "label": "INTERNET",   "col": "#888888", "info": "External network. Untrusted traffic ingress." },
      { "id": "fw",     "label": "FIREWALL",   "col": "#ff3b3b", "info": "iptables + pfSense perimeter firewall. DPI enabled." },
      { "id": "router", "label": "ROUTER",     "col": "#00d4ff", "info": "Edge router. BGP/OSPF routing with VLAN segmentation." },
      { "id": "devops", "label": "DEVOPS",     "col": "#00d4ff", "info": "Infrastructure automation. CI/CD pipelines and container orchestration." },
      { "id": "dev",    "label": "DEV",        "col": "#00ff88", "info": "Application development stack. React, Node.js, Firebase." },
      { "id": "sec",    "label": "SECURITY",   "col": "#ff3b3b", "info": "Pentesting environment and offensive security tooling." },
      { "id": "kali",   "label": "KALI BOX",   "col": "#ff3b3b", "info": "Kali Linux attack node with Metasploit, Burp Suite and recon tools." },
      { "id": "db",     "label": "DATABASE",   "col": "#00ff88", "info": "Primary data store. PostgreSQL with encrypted backups." },
      { "id": "k8s",    "label": "K8S CLUSTER","col": "#00d4ff", "info": "Kubernetes cluster secured with Calico network policies." },
      { "id": "mon",    "label": "MONITORING", "col": "#888888", "info": "Prometheus metrics collection with Grafana dashboards." }
    ]
  },
  "socials": [
    { "platform": "github",    "label": "GitHub",    "url": "https://github.com/grim-sudo",                  "icon": "github" },
    { "platform": "linkedin",  "label": "LinkedIn",  "url": "https://linkedin.com/in/shefan-tharani",         "icon": "linkedin" },
    { "platform": "discord",   "label": "Discord",   "url": "https://discord.com/users/563804599119773708",   "icon": "discord" },
    { "platform": "email",     "label": "Email",     "url": "mailto:shefantharani42@gmail.com",               "icon": "mail" },
    { "platform": "instagram", "label": "Instagram", "url": "https://instagram.com/grim_756",                 "icon": "instagram" }
  ],
  "skills": [
    {
      "category": "programming",
      "items": [
        { "name": "C" },
        { "name": "Python" },
        { "name": "JavaScript" },
        { "name": "Java" },
        { "name": "Bash" },
        { "name": "PyTorch" },
        { "name": "Go" },
        { "name": "Rust" },
        { "name": "SQL" }
      ]
    },
    {
      "category": "web_stack",
      "items": [
        { "name": "React" },
        { "name": "Vite" },
        { "name": "Firebase" },
        { "name": "Node.js" },
        { "name": "Next.js" },
        { "name": "Supabase" },
        { "name": "PostgreSQL" },
        { "name": "MySQL" }
      ]
    },
    {
      "category": "devops",
      "items": [
        { "name": "Docker" },
        { "name": "Kubernetes" },
        { "name": "Calico_CNI" },
        { "name": "GNS3" },
        { "name": "System Design" }
      ]
    },
    {
      "category": "security",
      "type": "red",
      "items": [
        { "name": "Pentesting" },
        { "name": "Networking" },
        { "name": "Firewalls" },
        { "name": "Metasploit" },
        { "name": "Ethical Hacking" }
      ]
    },
    {
      "category": "systems",
      "items": [
        { "name": "Linux/Unix" },
        { "name": "Kernel_Dev" },
        { "name": "Net_Stack" },
        { "name": "Systemd" }
      ]
    }
  ],
  "projects": [
    {
      "name": "lost_and_found_webapp",
      "desc": "Real-time Firebase app with auth, moderated submissions, and production-ready sync.",
      "tags": ["firebase", "js", "react"],
      "badge": "live",
      "url": "https://github.com/grim-sudo"
    }
  ],
  "achievements": [
    { "label": "recon_operator",       "desc": "Mapped internal lab networks fast and clean.",                                 "hover": "Found high-value pivot points across segmented subnets.", "type": "red" },
    { "label": "web_deployer",         "desc": "Shipped a full-stack app with auth and live sync.",                            "hover": "Production flow included hardened auth routes and abuse controls.", "type": "" },
    { "label": "kernel_explorer",      "desc": "Worked with Linux internals at syscall depth.",                                "hover": "Built stronger intuition for privilege boundaries and process behavior.", "type": "red" },
    { "label": "firewall_warden",      "desc": "Automated firewall rules with threat intel hooks.",                            "hover": "Turned noisy indicators into real-time blocking decisions.", "type": "" },
    { "label": "python_serpent",       "desc": "Built recon tooling for scans, fingerprints, and JSON output.",                "hover": "Cut repetitive recon steps into one repeatable pipeline.", "type": "" },
    { "label": "net_phantom",          "desc": "Strong TCP/IP and packet-level troubleshooting under pressure.",               "hover": "From subnet math to packet captures, no blind spots in the path.", "type": "red" },
    { "label": "container_breaker",    "desc": "Tested container escape paths and K8s privilege boundaries.",                 "hover": "Focused on misconfig chains, namespace leaks, and workload exposure.", "type": "red" },
    { "label": "packet_sniffer",       "desc": "Performed deep traffic analysis with Wireshark and tcpdump.",                  "hover": "Correlated packet traces to root-cause incidents faster.", "type": "" },
    { "label": "automation_engineer",  "desc": "Automated recon and reporting to remove manual drag.",                         "hover": "Delivered reusable scripts for repeatable investigations.", "type": "" },
    { "label": "threat_hunter",        "desc": "Hunted vulnerabilities through controlled adversarial labs.",                  "hover": "Validated attack paths and turned findings into hardening actions.", "type": "" },
    { "label": "arch_operator",        "desc": "Ran Arch daily with custom kernel and system tuning.",                         "hover": "Maintained a stable, performance-tuned workstation for offensive workflows.", "type": "" }
  ]
}
