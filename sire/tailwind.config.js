// colors come from css vars in src/index.css so light/dark just works
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)', card: 'var(--card)', ink: 'var(--ink)', mute: 'var(--mute)', line: 'var(--line)',
        accent: 'var(--accent)', onaccent: 'var(--accentInk)', warm: 'var(--warm)', bad: 'var(--bad)', soft: 'var(--soft)',
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'system-ui', 'sans-serif'],
        body: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
