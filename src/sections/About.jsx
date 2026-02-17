import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';
import { getIcon } from '../utils/iconMap';
import portfolioData from '../../data.json';
import './About.css';

const About = () => {
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  const features = portfolioData.about.features.map(feature => ({
    ...feature,
    icon: getIcon(feature.icon),
  }));

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  };

  return (
    <section id="about" className="about" ref={ref}>
      <div className="container">
        <motion.div
          className="about-header"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          <motion.h2 className="section-title" variants={itemVariants}>
            About <span className="gradient-text">Me</span>
          </motion.h2>
          <motion.p className="section-subtitle" variants={itemVariants}>
            Get to know more about me
          </motion.p>
        </motion.div>

        <div className="about-content">
          <motion.div
            className="about-text"
            variants={itemVariants}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
          >
            <h3>I'm a Creative Developer</h3>
            {portfolioData.about.description.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
            <div className="about-stats">
              <div className="stat-item">
                <span className="stat-number">{portfolioData.stats.projects}+</span>
                <span className="stat-label">Projects</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{portfolioData.stats.experience}+</span>
                <span className="stat-label">Years Experience</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{portfolioData.stats.satisfaction}%</span>
                <span className="stat-label">Satisfaction</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="about-features"
            variants={containerVariants}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="feature-card"
                variants={itemVariants}
                whileHover={{ scale: 1.05, y: -10 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <div className="feature-icon">
                  <feature.icon />
                </div>
                <h4>{feature.title}</h4>
                <p>{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
