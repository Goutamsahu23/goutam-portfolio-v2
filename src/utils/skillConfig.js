// Skill icon and color mappings
export const skillIconMap = {
  'React': 'FaReact',
  'JavaScript': 'FaJs',
  'TypeScript': 'SiTypescript',
  'HTML5': 'FaHtml5',
  'CSS3': 'FaCss3Alt',
  'Tailwind CSS': 'SiTailwindcss',
  'Vite': 'SiVite',
  'Node.js': 'FaNodeJs',
  'Express': 'SiExpress',
  'Python': 'FaPython',
  'MongoDB': 'SiMongodb',
  'PostgreSQL': 'SiPostgresql',
  'Database Design': 'FaDatabase',
  'Git': 'FaGitAlt',
};

export const skillColorMap = {
  'React': '#61DAFB',
  'JavaScript': '#F7DF1E',
  'TypeScript': '#3178C6',
  'HTML5': '#E34F26',
  'CSS3': '#1572B6',
  'Tailwind CSS': '#06B6D4',
  'Vite': '#646CFF',
  'Node.js': '#339933',
  'Express': '#000000',
  'Python': '#3776AB',
  'MongoDB': '#47A248',
  'PostgreSQL': '#336791',
  'Database Design': '#FFA500',
  'Git': '#F05032',
};

// Fallback color for skills not in the map
export const getSkillColor = (skillName) => {
  return skillColorMap[skillName] || '#667eea'; // Default purple gradient color
};

// Fallback icon name for skills not in the map
export const getSkillIcon = (skillName) => {
  return skillIconMap[skillName] || 'FaCog'; // Default cog icon
};

// Social link icon and color mappings
export const socialIconMap = {
  'GitHub': 'FaGithub',
  'LinkedIn': 'FaLinkedin',
  'Twitter': 'FaTwitter',
  'Email': 'FaEnvelope',
};

export const socialColorMap = {
  'GitHub': '#333',
  'LinkedIn': '#0077b5',
  'Twitter': '#1da1f2',
  'Email': '#ea4335',
};

// About features icon mapping
export const featureIconMap = {
  'Clean Code': 'FaCode',
  'Fast Performance': 'FaRocket',
  'Passionate': 'FaHeart',
};
