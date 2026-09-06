/** @type {import('tailwindcss').Config} */

/*
 * Esta configuracion reproduce exactamente la que hasta ahora vivia embebida
 * en index.html y se ejecutaba en el navegador de cada visitante via
 * cdn.tailwindcss.com. Al pasar al build desaparece el parpadeo sin estilos
 * de la primera carga y el CSS se purga en vez de enviarse entero.
 */
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        'tertiary-fixed-dim': '#ffb786',
        'inverse-on-surface': '#283044',
        'primary-fixed-dim': '#adc6ff',
        'surface-bright': '#31394d',
        'inverse-primary': '#005ac2',
        'outline-variant': '#424754',
        tertiary: '#ffb786',
        surface: '#0b1326',
        'tertiary-fixed': '#ffdcc6',
        'on-primary-fixed': '#001a42',
        'on-tertiary-fixed': '#311400',
        'on-secondary-fixed': '#111c2d',
        'on-background': '#dae2fd',
        'on-tertiary-fixed-variant': '#723600',
        'on-primary-container': '#00285d',
        'surface-variant': '#2d3449',
        'inverse-surface': '#dae2fd',
        'surface-container-highest': '#2d3449',
        'surface-container': '#171f33',
        'secondary-container': '#3e495d',
        'on-surface': '#dae2fd',
        'on-surface-variant': '#c2c6d6',
        'on-error-container': '#ffdad6',
        'on-secondary-fixed-variant': '#3c475a',
        outline: '#8c909f',
        'surface-dim': '#0b1326',
        secondary: '#bcc7de',
        'primary-container': '#4d8eff',
        'surface-tint': '#adc6ff',
        'on-secondary': '#263143',
        'error-container': '#93000a',
        background: '#0b1326',
        'on-tertiary': '#502400',
        'on-primary-fixed-variant': '#004395',
        'on-tertiary-container': '#461f00',
        'on-error': '#690005',
        'surface-container-low': '#131b2e',
        'surface-container-high': '#222a3d',
        error: '#ffb4ab',
        'surface-container-lowest': '#060e20',
        'secondary-fixed-dim': '#bcc7de',
        'secondary-fixed': '#d8e3fb',
        'on-secondary-container': '#aeb9d0',
        'on-primary': '#002e6a',
        primary: '#adc6ff',
        'tertiary-container': '#df7412',
        'primary-fixed': '#d8e2ff',
      },
      borderRadius: {
        DEFAULT: '0.25rem',
        lg: '0.5rem',
        xl: '0.75rem',
        full: '9999px',
      },
      fontFamily: {
        headline: ['Inter'],
        body: ['Inter'],
        label: ['Inter'],
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
