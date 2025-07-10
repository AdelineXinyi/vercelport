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

export default function Home() {
  const [activeTab, setActiveTab] = useState('home');
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

  const projects = [
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

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-6 py-12">
        <div className="space-y-20">
          
          {/* Home Tab */}
          {activeTab === 'home' && (
            <div>
              {/* Hero Section */}
              <div className="flex flex-col lg:flex-row items-center justify-between gap-12 max-w-6xl mx-auto mb-32">
                <div className="flex-1 space-y-8">
                  <div>
                    <h1 className="text-5xl font-bold text-white mb-4">Xinyi Li</h1>
                    <p className="text-xl text-gray-300 mb-2">Software Engineer & Full-Stack Developer</p>
                    <p className="text-gray-400 flex items-center gap-2">
                      <MapPin size={16} />
                      San Francisco, California, United States
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
                    <a href="https://xinyi-li.dev" target="_blank" rel="noopener noreferrer" className="transform hover:scale-110 transition-transform duration-200">
                      <Globe className="w-6 h-6 text-gray-400 hover:text-white cursor-pointer transition-colors" />
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
                      <User size={16} />
                      🏠 Home
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
                      <Code size={16} />
                      💼 Projects
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
                      <Briefcase size={16} />
                      📄 Resume
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

              {/* GitHub Contributions Section */}
              <div 
                className="bg-gray-800/30 rounded-xl p-6 max-w-5xl mx-auto transform hover:scale-[1.01] transition-all duration-300 mb-24"
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
                              contrib.intensity === 1 ? '#0e4429' :
                              contrib.intensity === 2 ? '#006d32' :
                              contrib.intensity === 3 ? '#26a641' :
                              '#39d353',
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
                  
                  <div className="text-center">
                    <p className="text-sm text-gray-500">
                      Contributions: {contributions.length} loaded
                    </p>
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

              {/* About Me Section */}
              <div 
                className="bg-gray-800/30 rounded-xl p-6 max-w-5xl mx-auto transform hover:scale-[1.01] transition-all duration-300 mb-24"
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

              {/* Skills Section */}
              <div 
                className="bg-gray-800/30 rounded-xl p-6 max-w-5xl mx-auto transform hover:scale-[1.01] transition-all duration-300"
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
            </div>
          )}

          {/* Projects Tab */}
          {activeTab === 'projects' && (
            <div className="max-w-5xl mx-auto space-y-12">
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
          )}

          {/* Resume Tab */}
          {activeTab === 'resume' && (
            <div className="max-w-5xl mx-auto">
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
          )}

        </div>
      </div>
    </div>
  );
}