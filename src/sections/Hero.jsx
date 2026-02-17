import { useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { FaArrowDown } from 'react-icons/fa';
import { getIcon } from '../utils/iconMap';
import { socialColorMap } from '../utils/skillConfig';
import portfolioData from '../../data.json';
import './Hero.css';

const Hero = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Smoother spring configuration for better follow effect
  const springConfig = { damping: 30, stiffness: 200, mass: 0.5 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);
  
  // Center the orb on cursor (orb is 500px, so offset by 250px)
  const x = useTransform(springX, (value) => value - 250);
  const y = useTransform(springY, (value) => value - 250);

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  const socialLinks = portfolioData.socialLinks.map(link => ({
    ...link,
    icon: getIcon(link.icon),
    color: socialColorMap[link.name] || '#667eea',
  }));

  const scrollToNext = () => {
    const aboutSection = document.querySelector('#about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: 'easeOut',
      },
    },
  };

  // Generate floating particles
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    size: Math.random() * 4 + 2,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 20 + 15,
    delay: Math.random() * 5,
  }));

  // Generate geometric shapes
  const shapes = [
    { type: 'circle', size: 80, x: 10, y: 20, duration: 20 },
    { type: 'triangle', size: 60, x: 85, y: 15, duration: 25 },
    { type: 'square', size: 50, x: 15, y: 80, duration: 18 },
    { type: 'circle', size: 40, x: 90, y: 70, duration: 22 },
    { type: 'triangle', size: 45, x: 5, y: 50, duration: 24 },
  ];

  return (
    <section id="home" className="hero">
      <div className="hero-background">
        {/* Grid pattern */}
        <div className="grid-pattern" />
        
        {/* Gradient orb - keeping as requested */}
        <motion.div
          className="gradient-orb"
          style={{
            x: x,
            y: y,
          }}
        />
        
        {/* Floating particles */}
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="floating-particle"
            style={{
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              left: `${particle.x}%`,
              top: `${particle.y}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 0.7, 0.3],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: particle.delay,
            }}
          />
        ))}

        {/* Geometric shapes */}
        {shapes.map((shape, index) => (
          <motion.div
            key={index}
            className={`floating-shape shape-${shape.type}`}
            style={{
              width: shape.type === 'triangle' ? `${shape.size}px` : `${shape.size}px`,
              height: shape.type === 'triangle' ? `${shape.size}px` : `${shape.size}px`,
              left: `${shape.x}%`,
              top: `${shape.y}%`,
              '--size': `${shape.size}px`,
            }}
            animate={{
              y: [0, -40, 0],
              rotate: [0, 360],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: shape.duration,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: index * 2,
            }}
          />
        ))}

        {/* Animated lines */}
        <svg className="animated-lines" viewBox="0 0 1000 1000" preserveAspectRatio="none">
          <motion.path
            d="M0,500 Q250,300 500,500 T1000,500"
            stroke="rgba(102, 126, 234, 0.2)"
            strokeWidth="2"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.3 }}
            transition={{ duration: 3, repeat: Infinity, repeatType: 'reverse' }}
          />
          <motion.path
            d="M0,300 Q500,200 1000,300"
            stroke="rgba(118, 75, 162, 0.2)"
            strokeWidth="2"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.3 }}
            transition={{ duration: 4, repeat: Infinity, repeatType: 'reverse', delay: 1 }}
          />
        </svg>
      </div>

      <div className="hero-container">
        <motion.div
          className="hero-content"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            className="hero-badge"
            variants={itemVariants}
          >
            <span>{portfolioData.personal.badge}</span>
          </motion.div>

          <motion.h1 className="hero-title" variants={itemVariants}>
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              Hi, I'm{' '}
            </motion.span>
            <motion.span
              className="gradient-text"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
            >
              {portfolioData.personal.name}
            </motion.span>
          </motion.h1>

          <motion.div className="hero-role" variants={itemVariants}>
            <motion.span
              className="typing-text"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              {portfolioData.personal.title}
            </motion.span>
          </motion.div>

          <motion.p className="hero-description" variants={itemVariants}>
            {portfolioData.personal.description}
          </motion.p>

          <motion.div
            className="hero-buttons"
            variants={itemVariants}
          >
            <motion.a
              href="#projects"
              className="btn btn-primary"
              whileHover={{ scale: 1.05, boxShadow: '0 10px 30px rgba(102, 126, 234, 0.4)' }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.preventDefault();
                document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              View My Work
            </motion.a>
            <motion.a
              href="#contact"
              className="btn btn-secondary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.preventDefault();
                document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Get In Touch
            </motion.a>
          </motion.div>

          <motion.div
            className="hero-social"
            variants={itemVariants}
          >
            <span className="social-label">Follow me:</span>
            {socialLinks.map((social, index) => (
              <motion.a
                key={index}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon"
                whileHover={{ scale: 1.2, rotate: 5, y: -5 }}
                whileTap={{ scale: 0.9 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + index * 0.1 }}
              >
                <social.icon />
              </motion.a>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          className="hero-visual"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <div className="visual-card">
            <div className="card-glow" />
            <div className="stats-grid">
              <motion.div
                className="stat-box"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8, type: 'spring' }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <div className="stat-number">{portfolioData.stats.projects}+</div>
                <div className="stat-label">Projects</div>
              </motion.div>
              <motion.div
                className="stat-box"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1, type: 'spring' }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <div className="stat-number">{portfolioData.stats.experience}+</div>
                <div className="stat-label">Years Exp</div>
              </motion.div>
              <motion.div
                className="stat-box"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2, type: 'spring' }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <div className="stat-number">{portfolioData.stats.satisfaction}%</div>
                <div className="stat-label">Satisfaction</div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        className="scroll-indicator"
        initial={{ x: '-50%', y: 0 }}
        animate={{ x: '-50%', y: [0, 10, 0] }}
        transition={{ 
          x: { duration: 0 },
          y: { duration: 2, repeat: Infinity, ease: 'easeInOut' }
        }}
        onClick={scrollToNext}
      >
        <FaArrowDown />
      </motion.div>
    </section>
  );
};

export default Hero;
