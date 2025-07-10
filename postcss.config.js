const tailwindcss = require('tailwindcss');
const autoprefixer = require('autoprefixer');

module.exports = {
  // 确保这里有一个名为 'plugins' 的键
  plugins: {
    tailwindcss: {}, // 这是 Tailwind CSS 插件的标准配置方式
    autoprefixer: {}, // 这是 Autoprefixer 插件的标准配置方式
    // 如果你有其他 PostCSS 插件，也会在这里添加
  },
};