// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}', // 确保这里包含了所有你需要扫描 Tailwind 类的文件路径
    // './pages/**/*.{js,ts,jsx,tsx,mdx}', // 如果你的项目使用 Pages Router
    // './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};