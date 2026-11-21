// Resume content. Source: PORTFOLIO_PROMPT.md. Do not invent facts.

export const profile = {
  name: 'Shridhar Sudam Chavan',
  shortName: 'Shridhar Chavan',
  tagline: 'MERN Developer · AI/ML & NLP Enthusiast · Vibe Coder',
  roles: ['MERN Developer', 'AI/ML Explorer', 'NLP Builder', 'Vibe Coder'],
  location: 'Satara, Maharashtra, India',
  email: 'shridharchavan03@gmail.com',
  linkedin: 'https://www.linkedin.com/in/shridhar-chavan/',
  resumePdf: '/Shridhar_Chavan_Resume.pdf',
  about: [
    'Computer Science (MCA) graduate with a solid foundation in programming, web development and data structures.',
    'Passionate about building efficient, user-friendly software, now focused on the MERN stack, AI/ML and NLP, and AI-assisted “vibe coding” workflows.',
    'Quick learner and team player. UGC NET qualified (Jan 2025).',
  ],
  languages: ['Marathi (native)', 'Hindi', 'English'],
}

export const experience = [
  {
    role: 'Trainee Frontend Developer',
    company: 'CodexLabz Technologies',
    place: 'Sangli',
    period: 'Jan 2024 – Jun 2024',
    points: [
      'Built a responsive web application with HTML, CSS and JavaScript',
      'Worked with the backend team to integrate data flow and dynamic content',
      'Fixed cross-browser compatibility issues',
    ],
  },
]

export const education = [
  {
    degree: 'MCA',
    school: 'Government College of Engineering, Karad',
    period: '2022 – 2024',
    score: 'GPA 8.74 / 10',
    detail: 'Data Structures, Computer Networks, DBMS, Cloud Computing',
  },
  {
    degree: 'BA Economics',
    school: 'Shivaji University, Kolhapur',
    period: '2019 – 2022',
    score: 'GPA 8.4 / 10',
    detail: 'Indian Economy, Stock Market (BSE)',
  },
  { degree: 'HSC', school: 'Maharashtra State Board', period: '2019', score: '68.92%' },
  { degree: 'SSC', school: 'Maharashtra State Board', period: '2017', score: '93.20%' },
]

export const skillGroups = [
  { title: 'MERN', items: ['MongoDB', 'Express.js', 'React', 'Node.js'], span: 'wide' },
  {
    title: 'AI/ML & NLP',
    items: [
      'Machine Learning fundamentals',
      'NLP',
      'LLM integration',
      'Google Cloud ML',
      'Azure ML',
    ],
    span: 'tall',
  },
  { title: 'Languages', items: ['JavaScript', 'TypeScript', 'C++', 'C', 'Java'], span: 'normal' },
  { title: 'Web', items: ['HTML', 'CSS', 'Bootstrap', 'Tailwind'], span: 'normal' },
  { title: 'Data & Cloud', items: ['MySQL', 'MongoDB', 'Google Cloud'], span: 'normal' },
  { title: 'Workflow', items: ['Git', 'Vercel', 'Vibe Coding with Claude Code'], span: 'normal' },
] as const

export const certifications = [
  { name: 'Google Cloud Foundation', issuer: 'Google Cloud' },
  { name: 'Google Cloud Professional Machine Learning', issuer: 'Google Cloud' },
  { name: 'Azure ML Fundamentals', issuer: 'Microsoft' },
  { name: 'Bootstrap Framework', issuer: 'Bootstrap' },
]

export const leadership = [
  { title: 'UGC NET Qualified', meta: 'Jan 2025', kind: 'Achievement' },
  { title: 'Aptitude Coordinator', meta: 'TPO 2024 (MCA)', kind: 'Leadership' },
  { title: 'Organizer, TECH-Manch', meta: 'Avishkar 2024, GCEK', kind: 'Leadership' },
  { title: 'General Secretary', meta: 'Chh. Shivaji College, Satara · 2022', kind: 'Leadership' },
  { title: 'National-level Boxing participant', meta: '2020', kind: 'Sport' },
  { title: 'Maths Olympiad', meta: '2018', kind: 'Achievement' },
  { title: 'Science Olympiad', meta: '2016', kind: 'Achievement' },
  { title: 'LIC Student of the Year', meta: '2016', kind: 'Achievement' },
]

export const navLinks = [
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'education', label: 'Education' },
  { id: 'contact', label: 'Contact' },
]
