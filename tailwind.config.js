 /** @type {import('tailwindcss').Config} */
export default {
   content: ["./src/**/*.{html,js,jsx}"],
   theme: {
     extend: {
       gridTemplateColumns: {
         '18': 'repeat(18, minmax(0, 1fr))',
       },
     },
   },
   plugins: [],
 }