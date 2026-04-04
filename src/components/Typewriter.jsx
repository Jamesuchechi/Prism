import { motion } from 'framer-motion'

export default function Typewriter({ text, speed = 0.03, delay = 0, onComplete }) {
  const characters = text.split('')

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: speed,
        delayChildren: delay,
      },
    },
  }

  const childVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.1,
      },
    },
  }

  return (
    <motion.span
      className="typewriter"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      onAnimationComplete={onComplete}
      aria-label={text}
    >
      {characters.map((char, index) => (
        <motion.span
          key={index}
          variants={childVariants}
          style={{ display: 'inline-block', whiteSpace: 'pre' }}
        >
          {char}
        </motion.span>
      ))}
      <style>{`
        .typewriter {
          display: inline;
        }
      `}</style>
    </motion.span>
  )
}
