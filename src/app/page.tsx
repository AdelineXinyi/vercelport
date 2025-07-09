'use client';

import React, { useState, useEffect } from 'react';
import { Mail, Linkedin, Instagram, Github, ExternalLink, Calendar, MapPin, User, Briefcase, Code, Award, Globe, BookOpen } from 'lucide-react';

// 定义类型接口
interface GitHubData {
  public_repos: number;
  followers: number;
  following: number;
  location?: string;
  name: string;
  bio?: string;
}

interface Contribution {
  id: string;
  date: string;
  count: number;
  intensity: number;
}

interface Experience {
  company: string;
  role: string;
  location?: string;
  period: string;
  description: string[];
}

interface Project {
  name: string;
  description: string;
  techStack: string[];
  githubUrl?: string;
  liveUrl?: string;
  featured: boolean;
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [githubData, setGithubData] = useState<GitHubData | null>(null);
  const [contributions, setContributions] = useState<Contribution[]>([]);

  // 获取GitHub用户数据
  useEffect(() => {
    const fetchGitHubData = async () => {
      try {
        // 获取用户基本信息
        const userResponse = await fetch('https://api.github.com/users/AdelineXinyi');
        const userData: GitHubData = await userResponse.json();
        setGithubData(userData);

        // 模拟贡献图数据
        const mockContributions = generateContributions();
        setContributions(mockContributions);
      } catch (error) {
        console.error('Error fetching GitHub data:', error);
        // fallback到模拟数据
        setContributions(generateContributions());
      }
    };

    fetchGitHubData();
  }, []);

  // GitHub贡献图数据生成
  const generateContributions = (): Contribution[] => {
    const contributions: Contribution[] = [];
    const weeks = 52;
    const daysInWeek = 7;
    
    for (let week = 0; week < weeks; week++) {
      for (let day = 0; day < daysInWeek; day++) {
        const intensity = Math.random();
        const date = new Date();
        date.setDate(date.getDate() - (weeks - week) * 7 + day);
        
        contributions.push({
          id: `${week}-${day}`,
          date: date.toISOString().split('T')[0],
          count: intensity > 0.8 ? Math.floor(Math.random() * 10) + 10 : 
                 intensity > 0.6 ? Math.floor(Math.random() * 5) + 5 :
                 intensity > 0.3 ? Math.floor(Math.random() * 3) + 1 : 0,
          intensity: intensity > 0.8 ? 4 : intensity > 0.6 ? 3 : intensity > 0.3 ? 2 : intensity > 0.1 ? 1 : 0
        });
      }
    }
    return contributions;
  };

  const skills = {
    programming: ['Python', 'JavaScript', 'TypeScript', 'Java', 'C++', 'SQL', 'R'],
    frontend: ['React.js', 'Vue.js', 'Next.js', 'HTML', 'CSS', 'Tailwind CSS', 'Bootstrap', 'Sass'],
    backend: ['Node.js', 'Express.js', 'Django', 'Flask', 'Spring Boot', 'PostgreSQL', 'MongoDB', 'Redis'],
    tools: ['Git', 'Docker', 'AWS', 'Figma', 'Jira', 'Postman', 'VS Code']
  };

  const experiences: Experience[] = [
    {
      company: 'Tech Company',
      role: 'Software Engineer Intern',
      location: 'San Francisco, CA',
      period: 'Jun. 2024 - Aug. 2024',
      description: [
        'Developed full-stack web applications using React.js and Node.js.',
        'Collaborated with cross-functional teams to deliver high-quality software solutions.',
        'Implemented responsive UI components and optimized application performance.'
      ]
    },
    {
      company: 'University Research Lab',
      role: 'Research Assistant',
      location: 'University Campus',
      period: 'Sep. 2023 - May. 2024',
      description: [
        'Conducted research on machine learning algorithms and data analysis.',
        'Published research findings and presented at academic conferences.'
      ]
    }
  ];

  const projects: Project[] = [
    {
      name: 'E-Commerce Platform',
      description: 'A full-stack e-commerce website with user authentication, shopping cart, and payment integration.',
      techStack: ['React', 'Node.js', 'MongoDB', 'Stripe'],
      githubUrl: 'https://github.com/AdelineXinyi/ecommerce-platform',
      liveUrl: 'https://ecommerce-demo.vercel.app',
      featured: true
    },
    {
      name: 'Data Visualization Dashboard',
      description: 'Interactive dashboard for analyzing and visualizing large datasets with multiple chart types.',
      techStack: ['Vue.js', 'D3.js', 'Python', 'Flask'],
      githubUrl: 'https://github.com/AdelineXinyi/data-dashboard',
      featured: true
    },
    {
      name: 'Mobile Task Manager',
      description: 'Cross-platform mobile app for task management with offline capabilities.',
      techStack: ['React Native', 'SQLite', 'Redux'],
      githubUrl: 'https://github.com/AdelineXinyi/task-manager',
      featured: false
    }
  ];

  const renderHome = () => (
    <div className="flex flex-col lg:flex-row items-center justify-between gap-12 max-w-6xl mx-auto">
      {/* 左侧个人信息 */}
      <div className="flex-1 space-y-8">
        <div>
          <h1 className="text-5xl font-bold text-white mb-4">Xinyi Li</h1>
          <p className="text-xl text-gray-300 mb-2">Software Engineer & Full-Stack Developer</p>
          <p className="text-gray-400 flex items-center gap-2">
            <MapPin size={16} />
            San Francisco, California, United States
          </p>
        </div>

        {/* 社交链接 */}
        <div className="flex gap-4">
          <a href="mailto:xinyi.li@example.com" className="transform hover:scale-110 transition-transform duration-200">
            <Mail className="w-6 h-6 text-gray-400 hover:text-white cursor-pointer transition-colors" />
          </a>
          <a href="https://linkedin.com/in/xinyi-li" target="_blank" rel="noopener noreferrer" className="transform hover:scale-110 transition-transform duration-200">
            <Linkedin className="w-6 h-6 text-gray-400 hover:text-white cursor-pointer transition-colors" />
          </a>
          <a href="https://github.com/AdelineXinyi" target="_blank" rel="noopener noreferrer" className="transform hover:scale-110 transition-transform duration-200">
            <Github className="w-6 h-6 text-gray-400 hover:text-white cursor-pointer transition-colors" />
          </a>
          <a href="https://xinyi-li.dev" target="_blank" rel="noopener noreferrer" className="transform hover:scale-110 transition-transform duration-200">
            <Globe className="w-6 h-6 text-gray-400 hover:text-white cursor-pointer transition-colors" />
          </a>
          <a href="https://medium.com/@xinyi-li" target="_blank" rel="noopener noreferrer" className="transform hover:scale-110 transition-transform duration-200">
            <BookOpen className="w-6 h-6 text-gray-400 hover:text-white cursor-pointer transition-colors" />
          </a>
        </div>

        {/* 导航按钮 */}
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={() => setActiveTab('home')}
            className={`px-6 py-3 rounded-lg border transition-all duration-200 flex items-center gap-2 transform hover:scale-105 ${
              activeTab === 'home' 
                ? 'bg-purple-500 border-purple-500 text-white' 
                : 'border-gray-600 text-gray-300 hover:border-gray-400'
            }`}
          >
            <User size={16} />
            🏠 Home
          </button>
          <button 
            onClick={() => setActiveTab('projects')}
            className={`px-6 py-3 rounded-lg border transition-all duration-200 flex items-center gap-2 transform hover:scale-105 ${
              activeTab === 'projects' 
                ? 'bg-purple-500 border-purple-500 text-white' 
                : 'border-gray-600 text-gray-300 hover:border-gray-400'
            }`}
          >
            <Code size={16} />
            💼 Projects
          </button>
          <button 
            onClick={() => setActiveTab('resume')}
            className={`px-6 py-3 rounded-lg border transition-all duration-200 flex items-center gap-2 transform hover:scale-105 ${
              activeTab === 'resume' 
                ? 'bg-purple-500 border-purple-500 text-white' 
                : 'border-gray-600 text-gray-300 hover:border-gray-400'
            }`}
          >
            <Briefcase size={16} />
            📄 Resume
          </button>
        </div>

        {/* 主题切换 */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
            <div className="w-4 h-4 bg-white rounded-full"></div>
          </div>
        </div>
      </div>

      {/* 右侧个人照片 */}
      <div className="flex-1 max-w-lg">
        <div className="relative transform hover:scale-105 transition-transform duration-300">
          <img 
            src="/images/image.jpg" 
            alt="Xinyi Li" 
            className="w-full h-auto rounded-2xl object-cover shadow-2xl"
          />
        </div>
      </div>
    </div>
  );

  const renderGitHubContributions = () => (
    <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/50 max-w-5xl mx-auto transform hover:scale-[1.01] transition-all duration-300 hover:border-gray-600">
      <div className="flex items-center gap-3 mb-6">
        <a href="https://github.com/AdelineXinyi" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 group">
          <Github className="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-200" />
          <h3 className="text-xl font-semibold text-white group-hover:text-purple-400 transition-colors">AdelineXinyi</h3>
        </a>
      </div>
      
      <div className="space-y-4">
        {/* 月份标签 */}
        <div className="flex justify-between text-sm text-gray-400 px-2">
          {['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map(month => (
            <span key={month}>{month}</span>
          ))}
        </div>
        
        {/* 贡献图 */}
        <div className="grid grid-cols-52 gap-1">
          {contributions.map((contrib) => (
            <div
              key={contrib.id}
              className={`w-3 h-3 rounded-sm cursor-pointer transition-all duration-200 hover:scale-110 hover:outline hover:outline-2 hover:outline-white ${
                contrib.intensity === 0 ? 'bg-gray-800' :
                contrib.intensity === 1 ? 'bg-purple-900' :
                contrib.intensity === 2 ? 'bg-purple-700' :
                contrib.intensity === 3 ? 'bg-purple-500' :
                'bg-purple-400'
              }`}
              title={`${contrib.count || 0} contributions on ${contrib.date || 'Unknown date'}`}
            />
          ))}
        </div>
        
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-400">
            {githubData ? `${githubData.public_repos} repositories` : 'Loading repositories...'}
          </p>
          <p className="text-sm text-gray-400">
            1,245 contributions in the last year
          </p>
        </div>
        
        {/* GitHub统计信息 */}
        {githubData && (
          <div className="flex flex-wrap gap-4 text-sm text-gray-400 pt-4 border-t border-gray-700">
            <span>👥 {githubData.followers} followers</span>
            <span>👤 {githubData.following} following</span>
            <span>📚 {githubData.public_repos} public repos</span>
            {githubData.location && <span>📍 {githubData.location}</span>}
          </div>
        )}
      </div>
    </div>
  );

  const renderAboutMe = () => (
    <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/50 max-w-5xl mx-auto transform hover:scale-[1.01] transition-all duration-300 hover:border-gray-600">
      <h2 className="text-2xl font-bold text-white mb-6">About Me:</h2>
      <div className="space-y-4 text-gray-300 leading-relaxed">
        <p>
          Hi, I'm Xinyi Li, a passionate software engineer with a strong background in full-stack development and a keen interest in creating innovative solutions that make a positive impact.
        </p>
        <p>
          I specialize in building scalable web applications using modern technologies like React, Node.js, and cloud platforms. My experience spans across frontend development, backend architecture, and database design.
        </p>
        <p>
          Currently, I'm exploring the exciting fields of <span className="text-purple-400 hover:text-purple-300 cursor-pointer transition-colors">machine learning</span> and <span className="text-purple-400 hover:text-purple-300 cursor-pointer transition-colors">artificial intelligence</span>, looking for ways to integrate these technologies into practical applications.
        </p>
        <p>
          When I'm not coding, I enjoy reading tech blogs, contributing to open-source projects, and exploring new frameworks and tools. I believe in continuous learning and staying updated with the latest industry trends.
        </p>
        <p>
          Feel free to reach out if you'd like to collaborate on interesting projects or just have a chat about technology!
        </p>
      </div>
    </div>
  );

  const renderExperience = () => (
    <div className="max-w-5xl mx-auto space-y-12">
      <h2 className="text-2xl font-bold text-white mb-8">Experience:</h2>
      
      {experiences.map((exp, index) => (
        <div key={index} className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-purple-600 rounded flex items-center justify-center text-white font-bold text-sm">
              {exp.company.charAt(0)}
            </div>
            <h3 className="text-xl font-semibold text-white">{exp.company}</h3>
          </div>
          
          <div className="flex flex-wrap gap-4 text-sm">
            <span className="bg-gray-700/50 border border-gray-600 px-3 py-1 rounded text-gray-300 hover:bg-gray-600/50 hover:border-gray-500 transition-all cursor-default">{exp.role}</span>
            {exp.location && (
              <span className="bg-gray-700/50 border border-gray-600 px-3 py-1 rounded text-gray-300 flex items-center gap-1 hover:bg-gray-600/50 hover:border-gray-500 transition-all cursor-default">
                📍 {exp.location}
              </span>
            )}
            <span className="bg-gray-700/50 border border-gray-600 px-3 py-1 rounded text-gray-300 flex items-center gap-1 hover:bg-gray-600/50 hover:border-gray-500 transition-all cursor-default">
              📅 {exp.period}
            </span>
          </div>
          
          <ul className="space-y-3 text-gray-300 ml-4">
            {exp.description.map((desc, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="text-purple-400 mt-1.5 text-sm">•</span>
                <span className="leading-relaxed">{desc}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
      
      <button className="text-gray-400 hover:text-white transition-all duration-200 transform hover:scale-105 font-medium">
        Show More
      </button>
    </div>
  );

  const renderSkills = () => (
    <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/50 max-w-5xl mx-auto transform hover:scale-[1.01] transition-all duration-300 hover:border-gray-600">
      <h2 className="text-2xl font-bold text-white mb-6">Skills & Technologies:</h2>
      
      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Programming Languages</h3>
          <div className="flex flex-wrap gap-2">
            {skills.programming.map(skill => (
              <span key={skill} className="bg-gray-700/50 border border-gray-600 px-3 py-1.5 rounded text-gray-300 text-sm hover:bg-gray-600/50 hover:border-gray-500 hover:scale-105 transition-all duration-200 cursor-default">
                {skill}
              </span>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Frontend Technologies</h3>
          <div className="flex flex-wrap gap-2">
            {skills.frontend.map(skill => (
              <span key={skill} className="bg-gray-700/50 border border-gray-600 px-3 py-1.5 rounded text-gray-300 text-sm hover:bg-gray-600/50 hover:border-gray-500 hover:scale-105 transition-all duration-200 cursor-default">
                {skill}
              </span>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Backend & Database</h3>
          <div className="flex flex-wrap gap-2">
            {skills.backend.map(skill => (
              <span key={skill} className="bg-gray-700/50 border border-gray-600 px-3 py-1.5 rounded text-gray-300 text-sm hover:bg-gray-600/50 hover:border-gray-500 hover:scale-105 transition-all duration-200 cursor-default">
                {skill}
              </span>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Tools & Platforms</h3>
          <div className="flex flex-wrap gap-2">
            {skills.tools.map(skill => (
              <span key={skill} className="bg-gray-700/50 border border-gray-600 px-3 py-1.5 rounded text-gray-300 text-sm hover:bg-gray-600/50 hover:border-gray-500 hover:scale-105 transition-all duration-200 cursor-default">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-6 py-12">
        <div className="space-y-12">
          {/* 主要内容区域 */}
          {activeTab === 'home' && (
            <>
              {renderHome()}
              <div className="mt-20 space-y-16">
                {renderGitHubContributions()}
                {renderAboutMe()}
                {renderExperience()}
                {renderSkills()}
              </div>
            </>
          )}
          
          {activeTab === 'projects' && (
            <div className="max-w-5xl mx-auto space-y-8">
              <h2 className="text-3xl font-bold text-white mb-8">Featured Projects</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {projects.filter(project => project.featured).map((project, index) => (
                  <div key={index} className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/50 transform hover:scale-[1.01] transition-all duration-300 hover:border-gray-600">
                    <h3 className="text-xl font-semibold text-white mb-3">{project.name}</h3>
                    <p className="text-gray-300 mb-4 leading-relaxed">{project.description}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.techStack.map((tech, i) => (
                        <span key={i} className="bg-purple-600/20 border border-purple-500/30 text-purple-300 px-3 py-1 rounded text-sm">
                          {tech}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex gap-4">
                      {project.githubUrl && (
                        <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" 
                           className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors hover:scale-105 transform duration-200">
                          <Github size={16} />
                          Code
                        </a>
                      )}
                      {project.liveUrl && (
                        <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
                           className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors hover:scale-105 transform duration-200">
                          <ExternalLink size={16} />
                          Live Demo
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="text-center mt-12">
                <a href="https://github.com/AdelineXinyi" target="_blank" rel="noopener noreferrer"
                   className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 px-8 py-3 rounded-lg transition-all duration-200 transform hover:scale-105 font-medium">
                  <Github size={16} />
                  View All Projects on GitHub
                </a>
              </div>
            </div>
          )}
          
          {activeTab === 'resume' && (
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl font-bold text-white mb-8">Resume</h2>
              <div className="bg-gray-800/30 rounded-xl p-8 border border-gray-700/50 transform hover:scale-[1.01] transition-all duration-300 hover:border-gray-600">
                <div className="text-center space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-white">Download my latest resume</h3>
                    <p className="text-gray-400">Get a comprehensive overview of my experience and skills</p>
                  </div>
                  
                  {/* 主要下载按钮 */}
                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <a 
                      href="/resume/q1.pdf" 
                      download="Xinyi_Li_Resume.pdf"
                      className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 px-8 py-3 rounded-lg transition-all duration-200 transform hover:scale-105 font-medium text-white"
                    >
                      📄 Download PDF Resume
                    </a>
                    
                    {/* 在线预览按钮 */}
                    <a 
                      href="/resume/q1.pdf" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 border border-purple-600 text-purple-400 hover:bg-purple-600 hover:text-white px-8 py-3 rounded-lg transition-all duration-200 transform hover:scale-105 font-medium"
                    >
                      👁️ Preview Online
                    </a>
                  </div>
                  
                  {/* 文件信息 */}
                  <div className="pt-4 border-t border-gray-700/50">
                    <p className="text-sm text-gray-500">
                      Last updated: December 2024 • PDF Format • 2 pages
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}