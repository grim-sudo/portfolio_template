// ═══════════════════════════════════════
// GRIM PORTFOLIO — data.js (ES module)
// ═══════════════════════════════════════

export const GRIM_DATA = {
  "identity": {
    "handle": "GRIM",
    "realname": "Shefan Tharani",
    "role": "Systems Engineer // Security Researcher",
    "tagline": "Building infrastructure. Exploiting systems. Securing what matters.",
    "github": "grim-sudo",
    "platform": "Arch / Kali / Debian",
    "toolset": "BlackArch · Metasploit · Burp Suite",
    "shell": "zsh / bash",
    "location": "CLASSIFIED",
    "clearance": "CLASSIFIED",
    "available": true
  },
  "mission": {
    "overview": "Systems engineer and security researcher specializing in Linux infrastructure, container orchestration, and offensive security operations.\n\nExperienced in designing and operating resilient systems while exploring attack surfaces across modern infrastructure. Works extensively with containerized environments, network architectures, and security testing methodologies.\n\nOperates at the intersection of DevOps engineering and adversarial security research, combining infrastructure development with offensive security experimentation to better understand and secure complex systems.",
    "platforms": [
      "Arch Linux","Kali Linux","Debian","BlackArch","Ubuntu Server","Unix-like Systems"
    ],
    "focusAreas": [
      "Penetration Testing",
      "Open Source Intelligence (OSINT)",
      "Network Reconnaissance & Enumeration",
      "Linux Systems Engineering & Kernel Development",
      "Offensive Security Labs & CTF Operations"
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
      "desc": "Firebase-backed web app with real-time sync and full user auth flow.",
      "tags": ["firebase", "js", "react"],
      "badge": "live",
      "url": "https://github.com/grim-sudo"
    }
  ],
  "achievements": [
    { "label": "recon_operator",       "desc": "Internal network scanning and full enumeration in isolated lab environments.",                 "type": "red" },
    { "label": "web_deployer",         "desc": "Shipped a Firebase-backed web app with real-time sync and user authentication.",               "type": "" },
    { "label": "kernel_explorer",      "desc": "Linux kernel modules and OS internals at the system call level.",                              "type": "red" },
    { "label": "firewall_warden",      "desc": "Automated firewall engine with live threat intel feed integration.",                           "type": "" },
    { "label": "python_serpent",       "desc": "Custom recon toolkit — port scanning, OS fingerprinting, JSON output.",                        "type": "" },
    { "label": "net_phantom",          "desc": "Deep knowledge of TCP/IP, subnetting and protocol-level packet analysis.",                     "type": "red" },
    { "label": "container_breaker",    "desc": "Explored container escape scenarios and Kubernetes privilege boundaries",                       "type": "red" },
    { "label": "packet_sniffer",       "desc": "Deep packet inspection and traffic analysis using Wireshark and tcpdump.",                     "type": "" },
    { "label": "automation_engineer",  "desc": "Developed Python automation tools for reconnaissance and reporting.",                          "type": "" },
    { "label": "threat_hunter",        "desc": "Investigated attack surfaces and vulnerabilities in controlled lab environments",               "type": "" },
    { "label": "arch_operator",        "desc": "Daily-driver Arch Linux environment with custom kernel tuning and tooling.",                   "type": "" }
  ]
}
