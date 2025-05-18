 /** @type {import('tailwindcss').Config} */
export default {
   content: ["./src/**/*.{html,js,jsx}"],
   darkMode: 'class',
   theme: {
     extend: {
       gridTemplateColumns: {
         '18': 'repeat(18, minmax(0, 1fr))',
       },
       animation: {
         'fadeIn': 'fadeIn 0.3s ease-in-out',
         'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
       },
       keyframes: {
         fadeIn: {
           '0%': { opacity: 0, transform: 'translateY(10px)' },
           '100%': { opacity: 1, transform: 'translateY(0)' },
         },
         pulse: {
           '0%, 100%': { opacity: 1 },
           '50%': { opacity: 0.5 },
         },
       },
     },
   },
   plugins: [],
 }