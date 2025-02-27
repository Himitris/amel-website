/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'silver': {
          300: '#e0e0e0',
          400: '#bdbdbd',
          500: '#9e9e9e',
          600: '#757575',
        },
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
      },
      backgroundImage: {
        'leopard-pattern': "url('data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M25,25 C30,20 35,20 40,25 C45,30 45,35 40,40 C35,45 30,45 25,40 C20,35 20,30 25,25 Z' fill='rgba(158, 158, 158, 0.2)'/%3E%3Cpath d='M65,25 C70,20 75,20 80,25 C85,30 85,35 80,40 C75,45 70,45 65,40 C60,35 60,30 65,25 Z' fill='rgba(158, 158, 158, 0.2)'/%3E%3Cpath d='M25,65 C30,60 35,60 40,65 C45,70 45,75 40,80 C35,85 30,85 25,80 C20,75 20,70 25,65 Z' fill='rgba(158, 158, 158, 0.2)'/%3E%3Cpath d='M65,65 C70,60 75,60 80,65 C85,70 85,75 80,80 C75,85 70,85 65,80 C60,75 60,70 65,65 Z' fill='rgba(158, 158, 158, 0.2)'/%3E%3C/svg%3E')",
      },
    },
  },
  plugins: [],
};