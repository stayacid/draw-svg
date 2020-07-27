import commands from 'path-ast/lib/keys';

export default {
  mobile: /iPhone|iPad|iPod|Android|webOS|BlackBerry|Windows Phone/i.test(
    navigator.userAgent,
  ),
  commands: Object.keys(commands).filter((key) => key.match(/[A-Z]/)),
  padding: 0,
  colors: {
    cyan: 'cyan',
    blue: '#0cf',
    dark: '#222',
    darken: 'rgba(0, 0, 0, 0.25)', 
    lighten: 'rgba(255, 255, 255, 0.25)',
  },
};
