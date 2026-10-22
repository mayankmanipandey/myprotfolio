// ==========================================
// CONFIGURATION FILE FOR MAYANK'S PORTFOLIO
// Easily customize your information, projects, and skills
// ==========================================
const SITE_CONFIG = {
  name: "Mayank Mani Pandey",
  initials: "MMP",
  role: "Electronics & Communication Engineering Student",
  typingRoles: [
    "Electronics & Communication Engineering Student",
    "Embedded Systems & IoT Builder",
    "Arduino & Hardware Prototyper",
    "Aspiring Hardware/Firmware Engineer"
  ],
  tagline: "Connecting physical hardware with intelligent code.",
  intro: "I’m an ECE student at Pondicherry University who builds practical systems with microcontrollers, IoT, sensors, and firmware — continuously turning hardware schematics into working, real-world solutions.",
  about: `I’m pursuing my B.Tech in Electronics and Communication Engineering at Pondicherry University. My engineering journey sits at the convergence of digital electronics, microcontroller architectures, IoT telemetry, and software development. Whether it's designing a circuit in Proteus, breadboarding an Arduino interface, writing debounced state-machine logic in C/C++, or creating full-stack dashboards to monitor remote sensors, I take pride in building robust, end-to-end technology solutions.`,
  
  email: "mayankmanipandey2004@gmail.com",
  phone: "+91 98765 43210",
  location: "Pondicherry, India",
  university: "Pondicherry University (Central University)",
  graduationYear: "2026",
  resume: "resume.html",

  social: {
    github: "https://github.com/mayankmanipandey",
    linkedin: "https://www.linkedin.com/in/mayank-mani-pandey/",
    instagram: "https://www.instagram.com/",
    email: "mailto:mayankmanipandey2004@gmail.com"
  },

  skills: [
    { name: "C / C++", category: "Programming", level: "Advanced", icon: "code", percent: 88 },
    { name: "Embedded C", category: "Hardware", level: "Advanced", icon: "cpu", percent: 85 },
    { name: "Python", category: "Programming", level: "Proficient", icon: "terminal", percent: 82 },
    { name: "Arduino & AVR", category: "Hardware", level: "Expert", icon: "chip", percent: 92 },
    { name: "IoT & ESP32", category: "Hardware", level: "Proficient", icon: "wifi", percent: 80 },
    { name: "Proteus Simulation", category: "Tools", level: "Advanced", icon: "activity", percent: 85 },
    { name: "MATLAB", category: "Tools", level: "Intermediate", icon: "bar-chart", percent: 75 },
    { name: "PCB Design & EDA", category: "Hardware", level: "Intermediate", icon: "layers", percent: 72 },
    { name: "DSA", category: "Programming", level: "Proficient", icon: "git-branch", percent: 78 },
    { name: "HTML / CSS / JS", category: "Web", level: "Proficient", icon: "globe", percent: 84 },
    { name: "Node.js & Express", category: "Web", level: "Intermediate", icon: "server", percent: 75 },
    { name: "Git & Linux", category: "Tools", level: "Proficient", icon: "command", percent: 80 }
  ],

  projects: [
    {
      id: "green-garuda",
      title: "Green Garuda Co.",
      category: "IoT",
      type: "Design Thinking & Smart IoT",
      image: "assets/img/green-garuda.jpg",
      description: "A circular waste-management ecosystem integrating IoT fill-level ultrasonic sensors, automated waste classification, and localized doorstep recycling collection.",
      details: "Green Garuda Co. tackles urban plastic and electronic waste by equipping collection nodes with sensor telemetry and pairing them with a resident incentive dashboard. The system promotes circular economy principles through tracked material flow.",
      highlights: [
        "Ultrasonic fill-level & weight telemetry simulation",
        "Automated reward point ledger for e-waste drop-offs",
        "Presented in competitive innovation sprints"
      ],
      tags: ["Sustainability", "IoT", "Product Design", "Sensors"],
      codeSnippet: `// Green Garuda IoT Telemetry Packet
struct WasteBinNode {
  uint8_t binId = 0x42;
  float fillLevelPercent = 78.4;
  bool lidLocked = false;
  int batteryMv = 3680;
};`,
      demoUrl: "#",
      githubUrl: "https://github.com/mayankmanipandey"
    },
    {
      id: "arduino-counter",
      title: "Arduino 7-Segment Digital Counter",
      category: "Embedded",
      type: "Embedded Systems & Logic",
      image: "assets/img/arduino-counter.jpg",
      description: "Hardware decimal counter utilizing common-cathode 7-segment LED display driven by ATmega328P with debounced push-button state machine.",
      details: "Engineered from breadboard schematic to firmware, this project features switch bounce suppression, BCD segment lookup arrays, and interrupt-driven increment/decrement control with zero ghosting.",
      highlights: [
        "Hardware pull-down button debouncing in software",
        "Direct pin-register manipulation for ultra-fast response",
        "Tested in Proteus before physical bench implementation"
      ],
      tags: ["Arduino", "C/C++", "Digital Logic", "Proteus"],
      codeSnippet: `const byte digits[10] = {
  0b00111111, // 0
  0b00000110, // 1
  0b01011011, // 2
  0b01001111, // 3
  0b01100110, // 4
  0b01101101, // 5
  0b01111101, // 6
  0b00000111, // 7
  0b01111111, // 8
  0b01101111  // 9
};`,
      demoUrl: "#interactive-lab",
      githubUrl: "https://github.com/mayankmanipandey"
    },
    {
      id: "lcd-buzzer",
      title: "Interactive LCD & Buzzer Telemetry Hub",
      category: "Embedded",
      type: "Embedded Microcontrollers",
      image: "assets/img/lcd-buzzer.jpg",
      description: "Interactive 16x2 alphanumeric liquid crystal interface with dynamic acoustic alert feedback, multi-mode menu selection, and sensor warning triggers.",
      details: "A complete hardware workstation interface featuring potentiometer contrast calibration, tone-frequency alarm profiles for emergency alerts, and scrolling real-time system status messages.",
      highlights: [
        "LiquidCrystal 4-bit parallel bus communication",
        "PWM-modulated piezo transducer multi-tone alarms",
        "Threshold breach detection with visual and audio alerts"
      ],
      tags: ["Arduino", "LCD 16x2", "PWM Audio", "Sensors"],
      codeSnippet: `void alertBeep(int frequency, int duration) {
  tone(BUZZER_PIN, frequency, duration);
  lcd.setCursor(0, 1);
  lcd.print("! WARNING ALERT !");
}`,
      demoUrl: "#",
      githubUrl: "https://github.com/mayankmanipandey"
    }
  ],

  achievements: [
    {
      title: "Hackathon Runner-Up",
      org: "Inter-College Innovation Sprint",
      year: "2025",
      badge: "Winner",
      icon: "trophy",
      text: "Designed and built an end-to-end hardware-software embedded prototype in a rigorous 36-hour hackathon, ranking in top 2 among 45+ university teams."
    },
    {
      title: "FOSSMeet Engineering Delegate",
      org: "Open Source Tech Forum",
      year: "2024",
      badge: "Community",
      icon: "award",
      text: "Participated in regional technical summit focused on open hardware tooling, Linux kernel basics, and collaborative development paradigms."
    },
    {
      title: "TEDx Community Operations",
      org: "Pondicherry University",
      year: "2024",
      badge: "Leadership",
      icon: "sparkles",
      text: "Coordinated technical and stage logistics for university TEDx talks, interacting with innovators across robotics, sustainability, and software."
    }
  ],

  timeline: [
    {
      period: "2022 — Present",
      title: "B.Tech in Electronics & Communication",
      place: "Pondicherry University",
      description: "Focused on microprocessors, embedded system programming, circuit design, digital signal processing, and IoT systems."
    },
    {
      period: "2023 — 2024",
      title: "Hardware & IoT Project Lead",
      place: "Academic Lab & Competitions",
      description: "Built working microcontroller projects, designed breadboard and PCB layouts, presented Green Garuda circular tech."
    },
    {
      period: "2025 — Future",
      title: "Firmware & Full-Stack Focus",
      place: "Internships & Career Target",
      description: "Seeking Core ECE, Embedded Systems, IoT, or Software Engineering Internships to deploy real-world production hardware."
    }
  ]
};

// Export for Node.js if in backend environment
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SITE_CONFIG;
}
