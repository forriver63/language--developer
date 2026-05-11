/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  safelist: [
    'bg-amber-100', 'border-amber-300', 'text-amber-900',
    'bg-rose-100', 'border-rose-300', 'text-rose-900',
    'bg-purple-100', 'border-purple-300', 'text-purple-900',
    'bg-sky-100', 'border-sky-300', 'text-sky-900',
    'bg-emerald-100', 'border-emerald-300', 'text-emerald-900',
    'bg-indigo-100', 'border-indigo-300', 'text-indigo-900',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"PingFang SC"', '"Microsoft YaHei"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
