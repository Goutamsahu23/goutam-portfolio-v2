import {
  FaGithub,
  FaLinkedin,
  FaTwitter,
  FaEnvelope,
  FaCode,
  FaRocket,
  FaHeart,
  FaReact,
  FaNodeJs,
  FaJs,
  FaPython,
  FaGitAlt,
  FaHtml5,
  FaCss3Alt,
  FaDatabase,
  FaCog,
} from 'react-icons/fa';
import {
  SiTypescript,
  SiMongodb,
  SiPostgresql,
  SiExpress,
  SiTailwindcss,
  SiVite,
} from 'react-icons/si';

const iconMap = {
  FaGithub,
  FaLinkedin,
  FaTwitter,
  FaEnvelope,
  FaCode,
  FaRocket,
  FaHeart,
  FaReact,
  FaNodeJs,
  FaJs,
  FaPython,
  FaGitAlt,
  FaHtml5,
  FaCss3Alt,
  FaDatabase,
  FaCog, // Fallback icon
  SiTypescript,
  SiMongodb,
  SiPostgresql,
  SiExpress,
  SiTailwindcss,
  SiVite,
};

export const getIcon = (iconName) => {
  return iconMap[iconName] || FaCog; // Return fallback icon if not found
};

export default iconMap;
