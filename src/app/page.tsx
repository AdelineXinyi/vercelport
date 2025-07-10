'use client';

import React, { useState, useEffect } from 'react';
import { Mail, Linkedin, Github, ExternalLink, MapPin, User, Briefcase, Code, Globe, BookOpen } from 'lucide-react';

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

// 定义 ActiveTab 类型
type ActiveTab = 'home' | 'projects' | 'resume';

export default function Home() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
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
        
        // 生成贡献图数据
        const mockContributions = generateContributions();
        console.log('Generated contributions:', mockContributions.length); // 调试信息
        setContributions(mockContributions);
      } catch (error) {
        console.error('Error fetching GitHub data:', error);
        // fallback到模拟数据
        const fallbackContributions = generateContributions();
        console.log('Fallback contributions:', fallbackContributions.length); // 调试信息
        setContributions(fallbackContributions);
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
    
    console.log('Generated contributions array:', contributions.slice(0, 5)); // 显示前5个元素
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
    }
  ];

  // Render Functions
  const renderHeroSection = () => (
    <div className="flex flex-col lg:flex-row items-center justify-between gap-12 max-w-6xl mx-auto mb-32">
      <div className="flex-1 space-y-8">
        <div>
          <h1 className="text-5xl font-bold text-white mb-4">Xinyi Li</h1>
          <p className="text-xl text-gray-300 mb-2">Software Engineer & Full-Stack Developer</p>
          <p className="text-gray-400 flex items-center gap-2">
            <MapPin size={16} />
            Ann Arbor, Michigan, United States
          </p>
        </div>

        {/* Social Links */}
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
          <a href="https://leetcode.com/u/xinyiaddie/" target="_blank" rel="noopener noreferrer" className="transform hover:scale-110 transition-transform duration-200" title="LeetCode Profile">
            <div className="w-6 h-6 text-gray-400 hover:text-white cursor-pointer transition-colors flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
                <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-2.8-2.265-6.942-1.985-9.383.641l-2.03 2.716L5.45 6.702l.65-.694c.79-.844 2.301-1.248 3.538-.955 1.25.297 2.457 1.184 2.457 1.184s.787.672 1.747.672c1.178 0 2.066-1.07 1.747-2.3-.318-1.23-1.747-2.3-1.747-2.3S11.5.797 9.66.797 6.25 2.125 6.25 2.125L13.483 0z"/>
              </svg>
            </div>
          </a>
        </div>

        {/* Navigation Buttons */}
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={() => setActiveTab('home')}
            className="px-6 py-3 rounded-lg transition-all duration-200 flex items-center gap-2 transform hover:scale-105"
            style={{
              backgroundColor: activeTab === 'home' ? '#8b5cf6' : '#374151',
              color: '#ffffff'
            }}
            onMouseEnter={(e) => {
              if (activeTab !== 'home') {
                e.currentTarget.style.backgroundColor = '#8b5cf6';
              }
              e.currentTarget.style.border = '2px solid white';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = activeTab === 'home' ? '#8b5cf6' : '#374151';
              e.currentTarget.style.border = 'none';
            }}
          >
            🗺 Home
          </button>
          <button 
            onClick={() => setActiveTab('projects')}
            className="px-6 py-3 rounded-lg transition-all duration-200 flex items-center gap-2 transform hover:scale-105"
            style={{
              backgroundColor: activeTab === 'projects' ? '#8b5cf6' : '#374151',
              color: '#ffffff'
            }}
            onMouseEnter={(e) => {
              if (activeTab !== 'projects') {
                e.currentTarget.style.backgroundColor = '#8b5cf6';
              }
              e.currentTarget.style.border = '2px solid white';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = activeTab === 'projects' ? '#8b5cf6' : '#374151';
              e.currentTarget.style.border = 'none';
            }}
          >
            🗿 Projects
          </button>
          <button 
            onClick={() => setActiveTab('resume')}
            className="px-6 py-3 rounded-lg transition-all duration-200 flex items-center gap-2 transform hover:scale-105"
            style={{
              backgroundColor: activeTab === 'resume' ? '#8b5cf6' : '#374151',
              color: '#ffffff'
            }}
            onMouseEnter={(e) => {
              if (activeTab !== 'resume') {
                e.currentTarget.style.backgroundColor = '#8b5cf6';
              }
              e.currentTarget.style.border = '2px solid white';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = activeTab === 'resume' ? '#8b5cf6' : '#374151';
              e.currentTarget.style.border = 'none';
            }}
          >
            🌋 Resume
          </button>
        </div>
      </div>

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
    <div 
      className="bg-gray-800/30 rounded-xl p-6 mx-auto transform hover:scale-[1.01] transition-all duration-300 mb-24"
      style={{ maxWidth: '48rem' }}
      onMouseEnter={(e) => {
        e.currentTarget.style.border = '2px solid white';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.border = 'none';
      }}
    >
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
        <div 
          className="inline-block overflow-hidden"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(52, 12px)',
            gap: '2px',
            padding: '10px'
          }}
        >
          {contributions.length > 0 ? (
            contributions.map((contrib) => (
              <div
                key={contrib.id}
                className="cursor-pointer transition-all duration-200 hover:scale-110"
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '2px',
                  backgroundColor: 
                    contrib.intensity === 0 ? '#161b22' :
                    contrib.intensity === 1 ? '#2d1b69' :
                    contrib.intensity === 2 ? '#553c9a' :
                    contrib.intensity === 3 ? '#8b5cf6' :
                    '#a855f7',
                  outline: 'none'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.outline = '2px solid white';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.outline = 'none';
                }}
                title={`${contrib.count || 0} contributions on ${contrib.date || 'Unknown date'}`}
              />
            ))
          ) : (
            // 备用显示：如果没有数据，显示占位符
            Array.from({length: 364}, (_, i) => (
              <div
                key={`placeholder-${i}`}
                className="cursor-pointer transition-all duration-200 hover:scale-110"
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '2px',
                  backgroundColor: '#161b22',
                  outline: 'none'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.outline = '2px solid white';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.outline = 'none';
                }}
                title="No contribution data"
              />
            ))
          )}
        </div>
        
       
        
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-400">
            {githubData ? `${githubData.public_repos} repositories` : 'Loading repositories...'}
          </p>
          <p className="text-sm text-gray-400">
            30 contributions in the last year
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

  const renderAboutMeSection = () => (
    <div 
      className="bg-gray-800/30 rounded-xl p-6 mx-auto transform hover:scale-[1.01] transition-all duration-300 mb-24"
      style={{ maxWidth: '48rem' }}
      onMouseEnter={(e) => {
        e.currentTarget.style.border = '2px solid white';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.border = 'none';
      }}
    >
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
      </div>
    </div>
  );

  const renderExperienceSection = () => (
    <div 
      className="bg-gray-800/30 rounded-xl p-6 mx-auto transform hover:scale-[1.01] transition-all duration-300 mb-24"
      style={{ maxWidth: '48rem' }}
      onMouseEnter={(e) => {
        e.currentTarget.style.border = '2px solid white';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.border = 'none';
      }}
    >
      <h2 className="text-2xl font-bold text-white mb-8">Experience:</h2>
      
      <div className="space-y-12">
        {experiences.map((exp, index) => (
          <div key={index} className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-purple-600 rounded flex items-center justify-center text-white font-bold text-sm">
                {exp.company.charAt(0)}
              </div>
              <h3 className="text-xl font-semibold text-white">{exp.company}</h3>
            </div>
            
            <div className="flex flex-wrap gap-4 text-sm">
              <span 
                className="bg-gray-700/50 px-3 py-1 rounded text-gray-300 transition-all cursor-default"
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#4b5563';
                  e.currentTarget.style.border = '1px solid white';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(55, 65, 81, 0.5)';
                  e.currentTarget.style.border = 'none';
                }}
              >
                {exp.role}
              </span>
              {exp.location && (
                <span 
                  className="bg-gray-700/50 px-3 py-1 rounded text-gray-300 flex items-center gap-1 transition-all cursor-default"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#4b5563';
                    e.currentTarget.style.border = '1px solid white';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(55, 65, 81, 0.5)';
                    e.currentTarget.style.border = 'none';
                  }}
                >
                  📍 {exp.location}
                </span>
              )}
              <span 
                className="bg-gray-700/50 px-3 py-1 rounded text-gray-300 flex items-center gap-1 transition-all cursor-default"
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#4b5563';
                  e.currentTarget.style.border = '1px solid white';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(55, 65, 81, 0.5)';
                  e.currentTarget.style.border = 'none';
                }}
              >
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
    </div>
  );

  const renderSkillsSection = () => (
    <div 
      className="bg-gray-800/30 rounded-xl p-6 mx-auto transform hover:scale-[1.01] transition-all duration-300"
      style={{ maxWidth: '48rem' }}
      onMouseEnter={(e) => {
        e.currentTarget.style.border = '2px solid white';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.border = 'none';
      }}
    >
      <h2 className="text-2xl font-bold text-white mb-6">Skills & Technologies:</h2>
      
      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Programming Languages</h3>
          <div className="flex flex-wrap gap-2">
            {skills.programming.map(skill => (
              <span 
                key={skill} 
                className="bg-gray-700/50 px-3 py-1.5 rounded text-gray-300 text-sm transition-all duration-200 cursor-default"
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#4b5563';
                  e.currentTarget.style.border = '1px solid white';
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(55, 65, 81, 0.5)';
                  e.currentTarget.style.border = 'none';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Frontend Technologies</h3>
          <div className="flex flex-wrap gap-2">
            {skills.frontend.map(skill => (
              <span 
                key={skill} 
                className="bg-gray-700/50 px-3 py-1.5 rounded text-gray-300 text-sm transition-all duration-200 cursor-default"
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#4b5563';
                  e.currentTarget.style.border = '1px solid white';
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(55, 65, 81, 0.5)';
                  e.currentTarget.style.border = 'none';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Backend & Database</h3>
          <div className="flex flex-wrap gap-2">
            {skills.backend.map(skill => (
              <span 
                key={skill} 
                className="bg-gray-700/50 px-3 py-1.5 rounded text-gray-300 text-sm transition-all duration-200 cursor-default"
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#4b5563';
                  e.currentTarget.style.border = '1px solid white';
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(55, 65, 81, 0.5)';
                  e.currentTarget.style.border = 'none';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Tools & Platforms</h3>
          <div className="flex flex-wrap gap-2">
            {skills.tools.map(skill => (
              <span 
                key={skill} 
                className="bg-gray-700/50 px-3 py-1.5 rounded text-gray-300 text-sm transition-all duration-200 cursor-default"
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#4b5563';
                  e.currentTarget.style.border = '1px solid white';
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(55, 65, 81, 0.5)';
                  e.currentTarget.style.border = 'none';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderProjectsTab = () => (
    <div className="max-w-4xl mx-auto space-y-12">
      <h2 className="text-3xl font-bold text-white mb-8">Featured Projects</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {projects.filter(project => project.featured).map((project, index) => (
          <div 
            key={index} 
            className="bg-gray-800/30 rounded-xl p-6 transform hover:scale-[1.01] transition-all duration-300"
            onMouseEnter={(e) => {
              e.currentTarget.style.border = '2px solid white';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.border = 'none';
            }}
          >
            <h3 className="text-xl font-semibold text-white mb-3">{project.name}</h3>
            <p className="text-gray-300 mb-4 leading-relaxed">{project.description}</p>
            
            <div className="flex flex-wrap gap-2 mb-6">
              {project.techStack.map((tech, i) => (
                <span 
                  key={i} 
                  className="bg-purple-600/20 text-purple-300 px-3 py-1 rounded text-sm transition-all"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.border = '1px solid white';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.border = 'none';
                  }}
                >
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
    </div>
  );

  const renderResumeTab = () => (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-white mb-12">Resume</h2>
      <div 
        className="bg-gray-800/30 rounded-xl p-8 transform hover:scale-[1.01] transition-all duration-300"
        onMouseEnter={(e) => {
          e.currentTarget.style.border = '2px solid white';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.border = 'none';
        }}
      >
        <div className="text-center space-y-6">
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-white">Download my latest resume</h3>
            <p className="text-gray-400">Get a comprehensive overview of my experience and skills</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a 
              href="/resume/q1.pdf" 
              download="Xinyi_Li_Resume.pdf"
              className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 px-8 py-3 rounded-lg transition-all duration-200 transform hover:scale-105 font-medium text-white"
            >
              📄 Download PDF Resume
            </a>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-6 py-12">
        <div className="space-y-20">
          
          {activeTab === 'home' && (
            <div>
              {renderHeroSection()}
              {renderGitHubContributions()}
              {renderAboutMeSection()}
              {renderExperienceSection()}
              {renderSkillsSection()}
            </div>
          )}

          {activeTab === 'projects' && (
            renderProjectsTab()
          )}

          {activeTab === 'resume' && (
            renderResumeTab()
          )}

        </div>
      </div>
    </div>
  );
}