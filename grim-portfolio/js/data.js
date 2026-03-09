// ═══════════════════════════════════════
// GRIM PORTFOLIO — data.js
// Single source of truth. Edit here or via admin.html
// ═══════════════════════════════════════

const GRIM_DATA = {

  identity: {
    handle:    "GRIM",
    realname:  "Shefan Tharani",
    role:      "Systems Engineer // Security Researcher",
    tagline:   "Building infrastructure. Exploiting systems. Securing what matters.",
    github:    "grim-sudo",
    platform:  "Arch / Kali / Debian",
    toolset:   "BlackArch · Metasploit · Burp Suite",
    shell:     "zsh / bash",
    location:  "CLASSIFIED",
    clearance: "CLASSIFIED",
    available: true,
  },

  mission: {
    overview: "Systems developer and security researcher focused on Linux infrastructure, container orchestration, and offensive security testing. Operates at the intersection of DevOps engineering and adversarial security.",
    platforms: ["Arch Linux","Kali Linux","Debian","BlackArch","Ubuntu Server"],
    focusAreas: [
      "Kubernetes security & container hardening",
      "Network reconnaissance & enumeration",
      "Linux systems engineering & kernel dev",
      "Offensive security labs & CTF ops",
    ],
    toolset: ["Metasploit","Burp Suite","Nmap / NSE","Docker","Kubernetes","Calico CNI","iptables","Shodan"],
  },

  boot: {
    lines: [
      {t:"[  0.000000] Linux kernel 6.6.30-arch1 detected",           c:""},
      {t:"[  0.001201] Arch system profile loaded",                    c:"ok"},
      {t:"[  0.082410] BlackArch toolkit mounted — 2900 tools ready", c:"ok"},
      {t:"[  0.213800] Kali pentest modules loaded",                   c:"ok"},
      {t:"[  0.881100] NET: Registered PF_INET6 protocol family",      c:""},
    ],
    accessMessage: "ACCESS GRANTED",
  },

  network: {
    nodes: [
      {id:"inet",  label:"INTERNET", col:"#888888", info:"External traffic. IDS monitored. Rate-limited."},
      {id:"fw",    label:"FIREWALL", col:"#ff3b3b", info:"iptables + pfSense. 247 rules. DPI enabled."},
      {id:"router",label:"ROUTER",   col:"#00d4ff", info:"BGP + OSPF. VLAN segmented. QoS active."},
      {id:"dev",   label:"DEV",      col:"#00ff88", info:"React, Firebase, Node.js dev cluster."},
      {id:"sec",   label:"SEC",      col:"#ff3b3b", info:"Pentest lab. Kali, Metasploit, Burp Suite."},
      {id:"ops",   label:"DEVOPS",   col:"#00d4ff", info:"K8s cluster. Docker, Calico, CI/CD."},
      {id:"db",    label:"DB",       col:"#00ff88", info:"Encrypted at rest. 6h backups."},
      {id:"kali",  label:"KALI",     col:"#ff3b3b", info:"Kali attack box. Air-gapped."},
      {id:"k8s",   label:"K8S",      col:"#00d4ff", info:"Kubernetes nodes. Calico enforced."},
      {id:"mon",   label:"MON",      col:"#888888", info:"Prometheus + Grafana + AlertManager."},
    ],
  },

  socials: [
    { platform: "github",   label: "GitHub",    url: "https://github.com/grim-sudo",        icon: "gh"  },
    { platform: "linkedin", label: "LinkedIn",  url: "https://linkedin.com/in/shefan",       icon: "li"  },
    { platform: "twitter",  label: "Twitter/X", url: "https://twitter.com/grim_sudo",        icon: "tw"  },
    { platform: "discord",  label: "Discord",   url: "https://discord.com/users/grim-sudo",  icon: "dc"  },
    { platform: "email",    label: "Email",     url: "mailto:shefan@example.com",            icon: "em"  },
    { platform: "medium",   label: "Blog",      url: "https://medium.com/@grim-sudo",        icon: "bl"  },
  ],

  skills: [
    {
      category: "programming",
      items: [
        { name: "C",           level: 85 },
        { name: "Python",      level: 90 },
        { name: "JavaScript",  level: 88 },
        { name: "Java",        level: 72 },
        { name: "Bash",        level: 83 },
      ]
    },
    {
      category: "web_stack",
      items: [
        { name: "React",      level: 85 },
        { name: "Vite",       level: 80 },
        { name: "Firebase",   level: 78 },
        { name: "Node.js",    level: 75 },
        { name: "npm",        level: 90 },
      ]
    },
    {
      category: "devops",
      items: [
        { name: "Docker",     level: 88 },
        { name: "Kubernetes", level: 82 },
        { name: "Calico_CNI", level: 70 },
        { name: "CI/CD",      level: 75 },
      ]
    },
    {
      category: "security",
      type: "red",
      items: [
        { name: "Pentesting",  level: 87 },
        { name: "Networking",  level: 85 },
        { name: "Firewalls",   level: 80 },
        { name: "Metasploit",  level: 78 },
        { name: "Kali_Linux",  level: 91 },
      ]
    },
    {
      category: "systems",
      items: [
        { name: "Linux/Unix",  level: 92 },
        { name: "Kernel_Dev",  level: 76 },
        { name: "Net_Stack",   level: 83 },
        { name: "Systemd",     level: 80 },
      ]
    },
  ],

  projects: [
    {
      name:  "lost_and_found_webapp",
      desc:  "Firebase-backed web app with real-time sync and full user auth flow.",
      tags:  ["firebase", "js", "react"],
      badge: "live",
      url:   "https://github.com/grim-sudo",
    },
    {
      name:  "kubernetes_security_lab",
      desc:  "Hardened K8s pentesting environment with Calico CNI network policies.",
      tags:  ["docker", "k8s", "calico"],
      badge: "active",
      url:   "https://github.com/grim-sudo",
    },
    {
      name:  "owasp_juice_shop_pentest",
      desc:  "Systematic exploitation of OWASP Top 10 in a controlled environment.",
      tags:  ["kali", "burp", "msf"],
      badge: "pentest",
      url:   "https://github.com/grim-sudo",
    },
    {
      name:  "network_recon_toolkit",
      desc:  "Python recon toolkit — port scan, OS fingerprinting, JSON report output.",
      tags:  ["python", "nmap"],
      badge: "active",
      url:   "https://github.com/grim-sudo",
    },
    {
      name:  "kernel_module_research",
      desc:  "Linux kernel module development and OS internals at syscall level.",
      tags:  ["C", "linux", "kernel"],
      badge: "research",
      url:   "https://github.com/grim-sudo",
    },
    {
      name:  "firewall_rule_engine",
      desc:  "Automated firewall engine with live threat intel feed integration.",
      tags:  ["python", "iptables"],
      badge: "live",
      url:   "https://github.com/grim-sudo",
    },
  ],

  achievements: [
    { icon: "🏗", label: "cluster_architect",  desc: "Built and hardened a Kubernetes pentesting env with Calico CNI network policies.", type: "red" },
    { icon: "🔍", label: "recon_operator",      desc: "Internal network scanning and full enumeration in isolated lab environments.",       type: "" },
    { icon: "🔥", label: "web_deployer",        desc: "Shipped a Firebase-backed web app with real-time sync and user authentication.",     type: "" },
    { icon: "⚙️", label: "kernel_explorer",     desc: "Linux kernel modules and OS internals at the system call level.",                   type: "red" },
    { icon: "🧩", label: "juice_shop_hacker",   desc: "Systematically exploited OWASP Top 10 in a controlled environment.",               type: "red" },
    { icon: "🛡",  label: "firewall_warden",    desc: "Automated firewall engine with live threat intel feed integration.",                 type: "" },
    { icon: "🐍", label: "python_serpent",      desc: "Custom recon toolkit — port scanning, OS fingerprinting, JSON output.",            type: "" },
    { icon: "🌐", label: "net_phantom",         desc: "Deep knowledge of TCP/IP, subnetting and protocol-level packet analysis.",         type: "red" },
  ],

};
