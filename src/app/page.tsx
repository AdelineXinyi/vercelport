/* src/app/page.tsx */
'use client';

import React, { useState, useEffect } from 'react';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css'; 
import { Mail, Linkedin, Github, ExternalLink, MapPin } from 'lucide-react';

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
  logo: string;
}

interface Project {
  name: string;
  description: string;
  techStack: string[];
  githubUrl?: string;
  liveUrl?: string;
  featured: boolean;
}

interface Education {
  institution: string;
  location: string;
  degree: string;
  major: string;
  period: string;
  gpa: string;
  courses?: string[];
  logo: string;
}

// 定义 ActiveTab 类型
type ActiveTab = 'home' | 'projects' | 'resume';

// ========== 辅助函数定义（在组件外部） ==========

const formatDateForTooltip = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { 
      month: 'long', 
      day: 'numeric'
    };
    return date.toLocaleDateString('en-US', options);
  } catch (error) {
    return dateString;
  }
};

// 获取贡献描述文本
const getContributionText = (count: number, date: string): string => {
  const formattedDate = formatDateForTooltip(date);
  
  if (count === 0) {
    return `No contributions on ${formattedDate}`;
  } else if (count === 1) {
    return `1 contribution on ${formattedDate}`;
  } else {
    return `${count} contributions on ${formattedDate}`;
  }
};

const calculateIntensity = (count: number): number => {
  if (count === 0) return 0;
  if (count <= 3) return 1;
  if (count <= 6) return 2;
  if (count <= 9) return 3;
  return 4; // 10+ contributions
};

// 数字动画组件
const AnimatedNumber = ({ 
  value, 
  duration = 1000,
  suffix = '' 
}: { 
  value: number, 
  duration?: number,
  suffix?: string 
}) => {
  const [displayValue, setDisplayValue] = useState(value);
  
  useEffect(() => {
    let startTime: number;
    let animationFrame: number;
    const startValue = displayValue;
    const targetValue = value;
    
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // 使用easeOut缓动函数
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.round(startValue + (targetValue - startValue) * easeOut);
      
      setDisplayValue(currentValue);
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };
    
    if (targetValue !== startValue) {
      animationFrame = requestAnimationFrame(animate);
    }
    
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [value, duration, displayValue]);
  
  return <span>{displayValue}{suffix}</span>;
};
const generateContributionsFromCompressed = (compressedData: {[key: string]: number}): Contribution[] => {
  const contributions: Contribution[] = [];
  
  // GitHub贡献图通常从去年7月第一个星期日开始
  // 根据你的数据，应该从2024年7月7日开始
  const startDate = new Date('2024-07-07'); // 星期日开始
  
  for (let week = 0; week < 53; week++) {
    for (let day = 0; day < 7; day++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + week * 7 + day);
      const dateString = currentDate.toISOString().split('T')[0];
      
      // 从压缩数据中查找该日期的贡献数
      const count = compressedData[dateString] || 0;
      
      contributions.push({
        id: `${week}-${day}`,
        date: dateString,
        count: count,
        intensity: calculateIntensity(count)
      });
    }
  }
  
  return contributions;
};

// 根据你的实际数据创建静态骨架屏
const createStaticContributions = (): Contribution[] => {
  const yourRealData = {
    "2024-08-08": 4,
    "2024-08-18": 3,
    "2024-09-09": 1,
    "2024-09-17": 1,
    "2024-09-24": 1,
    "2024-09-25": 1,
    "2024-09-29": 6,
    "2024-09-30": 4,
    "2024-10-01": 1,
    "2024-10-02": 2,
    "2024-10-12": 10,
    "2024-10-29": 17,
    "2024-11-01": 3,
    "2024-11-02": 3,
    "2024-11-04": 4,
    "2024-11-06": 3,
    "2024-11-07": 5,
    "2024-11-08": 2,
    "2024-11-10": 3,
    "2024-11-20": 2,
    "2024-11-21": 2,
    "2024-11-22": 2,
    "2024-11-27": 21,
    "2025-02-22": 6,
    "2025-02-23": 10,
    "2025-03-14": 3,
    "2025-03-20": 1,
    "2025-03-31": 1,
    "2025-04-05": 1,
    "2025-04-09": 1,
    "2025-05-21": 1,
    "2025-06-17": 1,
    "2025-06-20": 2,
    "2025-06-25": 1,
    "2025-07-02": 1,
    "2025-07-09": 4
  };
  
  return generateContributionsFromCompressed(yourRealData);
};
const generateSkeletonContributions = (): Contribution[] => {
  const contributions: Contribution[] = [];
  
  for (let week = 0; week < 53; week++) {
    for (let day = 0; day < 7; day++) {
      let intensity = 0;
      
      // 模拟典型的开发者贡献模式
      const isWeekend = day === 0 || day === 6;
      const isHolidayPeriod = week >= 25 && week <= 27; // 假期
      const isActiveProject = week >= 10 && week <= 16; // 项目高峰期
      const isRegularWork = week >= 35 && week <= 45; // 常规工作期
      
      if (isHolidayPeriod) {
        intensity = 0; // 假期无贡献
      } else if (isWeekend) {
        intensity = Math.random() < 0.2 ? 1 : 0; // 周末偶尔有贡献
      } else if (isActiveProject) {
        // 项目期间工作日有较多贡献
        const rand = Math.random();
        if (rand < 0.7) intensity = rand < 0.3 ? 3 : 2;
        else intensity = rand < 0.9 ? 1 : 0;
      } else if (isRegularWork) {
        // 常规工作期
        const rand = Math.random();
        if (rand < 0.6) intensity = rand < 0.2 ? 2 : 1;
        else intensity = 0;
      } else {
        // 其他时期偶尔有贡献
        intensity = Math.random() < 0.3 ? 1 : 0;
      }
      
      contributions.push({
        id: `skeleton-${week}-${day}`,
        date: `2024-07-${6 + week * 7 + day}`, // 假日期
        count: intensity * Math.floor(Math.random() * 3) + intensity,
        intensity: intensity
      });
    }
  }
  
  return contributions;
};
const fetchRealGitHubContributionsSecure = async (): Promise<Contribution[]> => {
  try {
    console.log('Attempting to fetch real GitHub contributions securely...');
    
    const response = await fetch('/api/github-contributions-secure');

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw new Error(`API Error: ${response.status} - ${errorData.message || 'Unknown error'}`);
    }

    const data = await response.json();

    if (!data.data?.user?.contributionsCollection) {
      throw new Error('Invalid response structure from GitHub API');
    }

    const calendar = data.data.user.contributionsCollection.contributionCalendar;
    const contributions: Contribution[] = [];

    calendar.weeks.forEach((week: any, weekIndex: number) => {
      week.contributionDays.forEach((day: any, dayIndex: number) => {
        contributions.push({
          id: `${weekIndex}-${dayIndex}`,
          date: day.date,
          count: day.contributionCount,
          intensity: calculateIntensity(day.contributionCount)
        });
      });
    });

    console.log(`✅ Successfully fetched ${contributions.length} real contributions`);
    return contributions;

  } catch (error) {
    console.error('Failed to fetch real GitHub contributions:', error);
    throw error;
  }
};

// ========== 主组件 ==========

export default function Home() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [githubData, setGithubData] = useState<GitHubData | null>(null);
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [showAllExperiences, setShowAllExperiences] = useState(false); 
  const [isLoadingContributions, setIsLoadingContributions] = useState(true);
  const [contributionsError, setContributionsError] = useState<string | null>(null);
  
  // 立即使用你的真实数据作为骨架屏
  const [skeletonContributions, setSkeletonContributions] = useState<Contribution[]>(() => {
    return createStaticContributions();
  });
  const [isClient, setIsClient] = useState(false);
  const [showFreshData, setShowFreshData] = useState(false); // 控制新数据动画
  const [showGithubModule, setShowGithubModule] = useState(false); // 控制整个模块显示
  
  // 用于平滑数字动画的状态
  const [statsData, setStatsData] = useState({
    repos: 11, // 基于你的静态数据
    totalContributions: 134, // 基于你的静态数据
    followers: 2,
    following: 1
  });

  // 客户端挂载后立即加载缓存数据
  useEffect(() => {
    setIsClient(true);
    setIsLoadingContributions(false); // 立即停止加载状态，因为我们有静态数据
    
    // 延迟显示整个GitHub模块，创建"浮现"效果
    setTimeout(() => {
      setShowGithubModule(true);
    }, 300); // 300ms后模块开始出现
    
    // 可选：检查localStorage缓存以获取更新的数据
    try {
      const cachedData = localStorage.getItem('github-contributions-cache');
      if (cachedData) {
        const parsed = JSON.parse(cachedData);
        const cacheTime = parsed.timestamp;
        const cacheAge = Date.now() - cacheTime;
        
        // 如果缓存不超过1小时，使用缓存数据
        if (cacheAge < 60 * 60 * 1000) {
          console.log('Using more recent cached data');
          setSkeletonContributions(parsed.data);
        }
      }
    } catch (e) {
      console.log('Cache parse error, using static data');
    }
  }, []); 
  
  const generateContributions = async (): Promise<Contribution[]> => {
    try {
      const realContributions = await fetchRealGitHubContributionsSecure();
      console.log('✅ Successfully loaded real GitHub contributions');
      return realContributions;
    } catch (error) {
      console.warn('⚠️ Failed to fetch real contributions:', error);
      return []; // 返回空数组，不显示贡献图
    }
  };

  // 获取GitHub用户数据
  useEffect(() => {
    if (!isClient) return;
    
    const fetchGitHubData = async () => {
      try {
        setContributionsError(null);
        
        // 获取用户基本信息
        const userResponse = await fetch('https://api.github.com/users/AdelineXinyi');
        if (userResponse.ok) {
          const userData: GitHubData = await userResponse.json();
          setGithubData(userData);
          
          // 平滑更新统计数据
          setTimeout(() => {
            setStatsData({
              repos: userData.public_repos,
              totalContributions: statsData.totalContributions, // 先保持贡献数不变
              followers: userData.followers,
              following: userData.following
            });
          }, 800); // 比贡献图稍晚更新
        }
        
        // 获取最新贡献数据
        const contributionsData = await generateContributions();
        
        if (contributionsData.length > 0) {
          console.log(`Loaded ${contributionsData.length} fresh contributions`);
          
          // 计算新的贡献总数
          const newTotalContributions = contributionsData.reduce((sum, contrib) => sum + contrib.count, 0);
          
          // 短暂延迟后显示新数据，创建平滑过渡效果
          setTimeout(() => {
            setContributions(contributionsData);
            setShowFreshData(true); // 触发淡入动画
            
            // 同时更新贡献总数
            setStatsData(prev => ({
              ...prev,
              totalContributions: newTotalContributions
            }));
          }, 500); // 500ms延迟让用户看到静态数据
          
          // 缓存数据
          try {
            localStorage.setItem('github-contributions-cache', JSON.stringify({
              data: contributionsData,
              timestamp: Date.now()
            }));
          } catch (e) {
            console.log('Failed to cache contributions data');
          }
        } else {
          setContributionsError('Unable to load contribution data');
        }
      } catch (error) {
        console.error('Error fetching GitHub data:', error);
        setContributionsError('Failed to load contribution data');
      } finally {
        setIsLoadingContributions(false);
      }
    };

    fetchGitHubData();
  }, [isClient]);

  const skills = {
    programming: ['Python', 'JavaScript', 'TypeScript', 'Java', 'C++', 'SQL', 'R'],
    frontend: ['React.js', 'Vue.js', 'Next.js', 'HTML', 'CSS', 'Tailwind CSS', 'Bootstrap', 'Sass'],
    backend: ['Node.js', 'Express.js', 'Django', 'Flask', 'Spring Boot', 'PostgreSQL', 'MongoDB', 'Redis'],
    tools: ['Git', 'Docker', 'AWS', 'Figma', 'Jira', 'Postman', 'VS Code']
  };

  const experiences: Experience[] = [
    {
      company: 'U-M Information and Technology Services - Data Integration',
      role: 'DevOps Intern',
      location: 'Ann Arbor, MN',
      period: 'May 2025 - Dec 2025 (extended)',
      description: [
       'Automated OpenAPI validation using Schemathesis across 42+ APIs, reducing swagger debugging from manual inspection to seconds-long validation and enabling rapid error fixes',
       'Built Python-based Apigee and Denodo CI/CD pipelines with GitHub Actions, reducing 5-step deployment workflows to 2 script executions and automating 53 API endpoint deployments with 90%+ time savings',
       'Developed Oracle-based API performance monitoring system to analyze response times across multiple partitions, proactively identifying performance issues and generating executive reports for upstream departments'
      ],
      logo: 'https://img.logo.dev/umich.edu?token=pk_L9-3-m3iR3qwyR9kIxfelA',
    },
    {
      company: 'Glimpse Diagnostic LLC',
      role: 'Data Engineer Intern',
      location: 'Arden Hills, MN',
      period: 'May 2023 - August 2023',
      description: [
        'Built generative adversarial networks model using Tensorflow and PyTorch in AWS Sagemaker to augment synthetic children tympanic membrane images from 726 to 2000 for training abnormal tympanic membrane recognition',
        'Optimized quality metrics including Fréchet Inception Distance(FID) derived during model training process to classify images under cross validation to enable an effective diagnostic source for medical practitioners',
        'Pre-processed image samples using NumPy and TensorFlow (keras) for image transformation (resizing, color uniforming) and utilized CUDA for GPU acceleration to optimize model training efficiency'
      ],
      logo: 'https://img.logo.dev/glimpsediagnostics.com?token=pk_L9-3-m3iR3qwyR9kIxfelA',
    },
    {
      company: 'Statistics Online Computational Resource (SOCR) Lab - University of Michigan',
      role: 'Undergrad Research Assistant',
      location: 'Ann Arbor, MI',
      period: 'May 2024 - Jan 2025',
      description: [
        'Run supervised and unsupervised classification to see if any experiment group cluster emerge on recasted clinical datasets (conditional mouse treatment) in R and Python',
        'Work on the deployment of applications on a Nursery School compute server and AWS S3, streamlining automated healthcare privacy document management in collaboration with Prof. Ivo Dinov\'s team'
      ],
      logo: 'https://img.logo.dev/umich.edu?token=pk_L9-3-m3iR3qwyR9kIxfelA',
    }
  ];

  const projects: Project[] = [
    {
      name: 'Instagram Ads Generator',
      description: 'Fine-tuned multiple instruction-tuned LLMs (LLaMA-3.1-8B, Qwen2.5-7B, Mistral-7B) using LoRA with 4-bit quantization and Flash Attention 2 to efficiently learn influencer-specific writing styles on a single A100 GPU',
      techStack: ['LLaMA-3.1-8B', 'Qwen2.5-7B', 'Mistral-7B', 'LoRA', 'SBERT', 'FAISS', 'GPT'],
      featured: true
    },
    {
      name: 'Facebook Clone Database System',
      description: 'Engineered a relational database system with 40% improved query efficiency, Java application development for processing 10,000+ records with 95% reduced response time, and a SQL-to-MongoDB data pipeline achieving 60% faster retrieval for complex hierarchical data.',
      techStack: ['Oracle SQL', 'Java', 'MongoDB'],
      featured: true
    },
    {
      name: 'Instagram-like Web App',
      description: 'Developed a full-stack Instagram-like web app with user authentication, file uploads, likes, comments, and follow/unfollow features. Built a RESTful API, integrated AJAX for dynamic updates, and optimized the frontend for a responsive single-page application experience.',
      techStack: ['JavaScript', 'SQLite3', 'HTML', 'Flask', 'Python', 'React.js', 'AWS EC2'],
      githubUrl: 'https://github.com/AdelineXinyi/instagram-clone',
      featured: false
    },
    {
      name: 'MapReduce Search Engine',
      description: 'Developed a distributed MapReduce system on Hadoop for efficient master-worker coordination and parallel task execution. Optimized job scheduling and resource allocation across nodes to improve throughput, reduce latency, and enhance fault tolerance.',
      techStack: ['Python', 'Hadoop', 'MapReduce'],
      featured: false
    }
  ];

  const education: Education[] = [
    {
      institution: 'University of Michigan-Ann Arbor',
      location: 'Ann Arbor, MI',
      degree: 'B.S',
      major: 'Computer Science',
      period: 'Aug 2023 - Dec 2025',
      gpa: '3.86/4.0',
      logo: 'https://img.logo.dev/umich.edu?token=pk_L9-3-m3iR3qwyR9kIxfelA',
    },
    {
      institution: 'Macalester College',
      location: 'Saint Paul, MN',
      degree: 'B.S',
      major: 'Economics',
      period: 'Aug 2021 - May 2023',
      gpa: '4.0/4.0',
      logo: 'https://img.logo.dev/macalester.edu?token=pk_L9-3-m3iR3qwyR9kIxfelA',
      courses: ['Data Structure & Algorithm', 'Object-Oriented Programming', 'Computer Organization', 'Advanced Regression', 'Web Systems', 'Natural Language Processing', 'Machine Learning', 'Database Management Systems']
    }
  ];

  // 增强的导航按钮组件
  const NavigationButton = ({ 
    tab, 
    icon, 
    label, 
    isActive 
  }: { 
    tab: ActiveTab, 
    icon: React.ReactNode, 
    label: string, 
    isActive: boolean 
  }) => (
    <button 
      onClick={() => setActiveTab(tab)}
      className={`px-6 py-3 rounded-lg transition-all duration-200 flex items-center gap-2 transform hover:scale-105 ${
        isActive ? 'ring-2 ring-white' : ''
      }`}
      style={{
        backgroundColor: isActive ? '#8b5cf6' : 'rgba(255, 255, 255, 0.2)',
        color: '#ffffff'
      }}
      onMouseEnter={(e) => {
        if (!isActive) {
          e.currentTarget.style.backgroundColor = '#8b5cf6';
        }
        e.currentTarget.style.border = '2px solid white';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = isActive ? '#8b5cf6' : 'rgba(255, 255, 255, 0.2)';
        e.currentTarget.style.border = 'none';
      }}
    >
      {icon}
      {label}
    </button>
  );

  // Render Functions
  const renderHeroSection = () => (
    <div className="flex flex-col lg:flex-row items-center justify-between gap-12 max-w-6xl mx-auto mb-32">
      <div className="flex-1 space-y-8">
        <div>
          <h1 className="text-5xl font-bold text-white mb-4">Xinyi Li</h1>
          <p className="text-xl text-gray-300 mb-2">Software Engineer & Full-Stack Developer</p>
          <p className="text-white flex items-center gap-2">
            <MapPin size={16} />
            Ann Arbor, Michigan, United States
          </p>
          <p className="text-white flex items-center gap-2">
            <MapPin size={16} />
            Shanghai, China
          </p>
        </div>

        {/* Social Links */}
        <div className="flex gap-4">
          <a href="mailto:xinyiade@umich.edu" className="transform hover:scale-110 transition-transform duration-200">
            <Mail className="w-6 h-6 text-gray-400 hover:text-white cursor-pointer transition-colors" />
          </a>
          <a href="https://linkedin.com/in/xinyi-li" target="_blank" rel="noopener noreferrer" className="transform hover:scale-110 transition-transform duration-200">
            <Linkedin className="w-6 h-6 text-white hover:text-white cursor-pointer transition-colors" />
          </a>
          <a href="https://github.com/AdelineXinyi" target="_blank" rel="noopener noreferrer" className="transform hover:scale-110 transition-transform duration-200">
            <Github className="w-6 h-6 text-white hover:text-white cursor-pointer transition-colors" />
          </a>
          <a href="https://leetcode.com/u/xinyiaddie/" target="_blank" rel="noopener noreferrer" className="transform hover:scale-110 transition-transform duration-200" title="LeetCode Profile">
            <div className="w-6 h-6 text-white hover:text-white cursor-pointer transition-colors flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
                <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-2.8-2.265-6.942-1.985-9.383.641l-2.03 2.716L5.45 6.702l.65-.694c.79-.844 2.301-1.248 3.538-.955 1.25.297 2.457 1.184 2.457 1.184s.787.672 1.747.672c1.178 0 2.066-1.07 1.747-2.3-.318-1.23-1.747-2.3-1.747-2.3S11.5.797 9.66.797 6.25 2.125 6.25 2.125L13.483 0z"/>
              </svg>
            </div>
          </a>
        </div>

        {/* Enhanced Navigation Buttons */}
        <div className="flex flex-wrap gap-3">
          <NavigationButton 
            tab="home" 
            icon={<span style={{fontSize: '18px'}}>🏠</span>} 
            label="Home" 
            isActive={activeTab === 'home'} 
          />
          <NavigationButton 
            tab="projects" 
            icon={<span style={{fontSize: '18px'}}>📁</span>} 
            label="Projects" 
            isActive={activeTab === 'projects'} 
          />
          <NavigationButton 
            tab="resume" 
            icon={<span style={{fontSize: '18px'}}>📄</span>} 
            label="Resume" 
            isActive={activeTab === 'resume'} 
          />
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
      className={`bg-gray-800/30 rounded-xl p-6 mx-auto transform hover:scale-[1.01] transition-all duration-300 mb-24 ${
        showGithubModule 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-8'
      }`}
      style={{ 
        maxWidth: '48rem',
        transition: 'opacity 1s ease-out, transform 1s ease-out'
      }}
      onMouseEnter={(e) => {
        if (showGithubModule) {
          e.currentTarget.style.border = '2px solid white';
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.border = 'none';
      }}
    >
      <div className={`flex items-center gap-3 mb-6 transition-all duration-700 delay-200 ${
        showGithubModule ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
      }`}>
        <a href="https://github.com/AdelineXinyi" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 group">
          <Github className="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-200" />
          <h3 className="text-xl font-semibold text-white group-hover:text-purple-400 transition-colors">AdelineXinyi</h3>
        </a>
      </div>

      <div className={`space-y-4 transition-all duration-700 delay-400 ${
        showGithubModule ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}>
        {/* 月份标签：保持不变，按你原先的要求 */}
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
            gridTemplateColumns: 'repeat(53, 12px)', // 53 columns for weeks
            gridTemplateRows: 'repeat(7, 12px)',   // 7 rows for days of the week
            gridAutoFlow: 'column', // Fill columns first (vertical then horizontal)
            gap: '2px',
            padding: '10px'
          }}
        >
          {contributions.length > 0 ? (
            contributions.map((contrib) => (
              <div
                key={contrib.id}
                data-tooltip-id="my-github-tooltip"
                data-tooltip-content={getContributionText(contrib.count || 0, contrib.date || '')}
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
              />
            ))
          ) : (
            // 智能显示：优先使用最新数据，回退到静态数据
            (() => {
              // 在服务器端，显示你的真实静态数据，避免水合错误
              if (!isClient) {
                return skeletonContributions.map((contrib) => (
                  <div
                    key={`ssr-${contrib.id}`}
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
                  />
                ));
              }
              
              // 客户端渲染：优先级：contributions > skeletonContributions
              const dataToShow = contributions.length > 0 ? contributions : skeletonContributions;
              
              if (dataToShow.length > 0) {
                // 显示真实数据或静态数据
                return dataToShow.map((contrib) => (
                  <div
                    key={contrib.id}
                    data-tooltip-id="my-github-tooltip"
                    data-tooltip-content={getContributionText(contrib.count || 0, contrib.date || '')}
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
                      outline: 'none',
                      opacity: contributions.length > 0 ? 1 : 0.9 // 静态数据稍微透明
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.outline = '2px solid white';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.outline = 'none';
                    }}
                  />
                ));
              } else {
                // 备用：显示空白网格
                return Array.from({length: 371}, (_, i) => (
                  <div
                    key={`fallback-${i}`}
                    className="cursor-pointer transition-all duration-200 hover:scale-110"
                    style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '2px',
                      backgroundColor: '#161b22',
                      outline: 'none'
                    }}
                  />
                ));
              }
            })()
          )}
        </div>

        <Tooltip
          id="my-github-tooltip"
          place="top"
          delayShow={100}
          delayHide={100}
          style={{
            backgroundColor: '#333e4d',
            color: '#ffffff',
            padding: '8px 12px',
            borderRadius: '6px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            zIndex: 9999,
            fontSize: '0.875rem'
          }}
        />

        <div className="flex items-center justify-between">
          <p className="text-sm text-white">
            {githubData ? `${githubData.public_repos} repositories` : 'Loading repositories...'}
          </p>
          <p className="text-sm text-white">
            {contributions.length > 0 
              ? `${contributions.reduce((sum, contrib) => sum + contrib.count, 0)} contributions in the last year` 
              : isLoadingContributions 
                ? 'GitHub activity' 
                : 'No contributions data'
            }
          </p>
        </div>

        {/* GitHub stats */}
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
      <div className="space-y-4 text-white leading-relaxed">
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

  const renderExperienceSection = () => {
    const displayedExperiences = showAllExperiences ? experiences : experiences.slice(0, 2);
    
    return (
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
          {displayedExperiences.map((exp, index) => (
            <div key={index} className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded flex items-center justify-center overflow-hidden bg-white">
                  <img 
                    src={exp.logo} 
                    alt={`${exp.company} logo`} 
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      const nextElement = e.currentTarget.nextElementSibling;
                      if (nextElement) {
                        (nextElement as HTMLElement).style.display = 'flex';
                      }
                    }}
                  />
                  <div className="w-full h-full bg-purple-600 rounded flex items-center justify-center text-white font-bold text-sm" style={{display: 'none'}}>
                    {exp.company.charAt(0)}
                  </div>
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
          
          {experiences.length > 2 && (
            <button 
              onClick={() => setShowAllExperiences(!showAllExperiences)}
              className="text-gray-400 hover:text-white transition-all duration-200 transform hover:scale-105 font-medium"
            >
              {showAllExperiences ? 'Show Less' : 'Show More'}
            </button>
          )}
        </div>
      </div>
    );
  };

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
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-white">Featured Projects</h2>
        {/* Navigation buttons for projects page */}
        <div className="flex gap-3">
          <NavigationButton 
            tab="home" 
            icon={<span style={{fontSize: '18px'}}>🏠</span>} 
            label="Home" 
            isActive={activeTab === 'home'} 
          />
          <NavigationButton 
            tab="projects" 
            icon={<span style={{fontSize: '18px'}}>📁</span>} 
            label="Projects" 
            isActive={activeTab === 'projects'} 
          />
          <NavigationButton 
            tab="resume" 
            icon={<span style={{fontSize: '18px'}}>📄</span>} 
            label="Resume" 
            isActive={activeTab === 'resume'} 
          />
        </div>
      </div>
      
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
      <div className="flex items-center justify-between mb-12">
        <h2 className="text-3xl font-bold text-white">Resume</h2>
        {/* Navigation buttons for resume page */}
        <div className="flex gap-3">
          <NavigationButton 
            tab="home" 
            icon={<span style={{fontSize: '18px'}}>🏠</span>} 
            label="Home" 
            isActive={activeTab === 'home'} 
          />
          <NavigationButton 
            tab="projects" 
            icon={<span style={{fontSize: '18px'}}>📁</span>} 
            label="Projects" 
            isActive={activeTab === 'projects'} 
          />
          <NavigationButton 
            tab="resume" 
            icon={<span style={{fontSize: '18px'}}>📄</span>} 
            label="Resume" 
            isActive={activeTab === 'resume'} 
          />
        </div>
      </div>
      
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
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a 
              href="/resume/resume.pdf" 
              download="Xinyi_Li_Resume.pdf"
              className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 px-8 py-3 rounded-lg transition-all duration-200 transform hover:scale-105 font-medium text-white"
            >
              Download PDF Resume
            </a>
          </div>
        </div>

        <div className="mt-8">
            <h3 className="text-xl font-semibold text-white mb-4">Preview</h3>
            <div className="w-full" style={{ aspectRatio: '1 / 1.414' }}>
                <iframe
                    src="/resume/resume.pdf#toolbar=0&navpanes=0&scrollbar=0"
                    className="w-full h-full rounded-lg"
                    style={{ border: 'none' }}
                />
            </div>
        </div>
      </div>
    </div>
  );

  const renderEducationSection = () => (
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
    <h2 className="text-2xl font-bold text-white mb-8">Education:</h2>
    
    <div className="space-y-8">
      {education.map((edu, index) => (
        <div key={index} className="space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded flex items-center justify-center overflow-hidden bg-white">
              <img 
                src={edu.logo} 
                alt={`${edu.institution} logo`} 
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                  if (nextElement) {
                    nextElement.style.display = 'flex';
                  }
                }}
              />
              <div className="w-full h-full bg-purple-600 rounded flex items-center justify-center text-white font-bold text-sm" style={{display: 'none'}}>
                {edu.institution.charAt(0)}
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white">{edu.institution}</h3>
              <p className="text-gray-400 text-sm">{edu.location}</p>
            </div>
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
              {edu.degree} in {edu.major}
            </span>
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
              📅 {edu.period}
            </span>
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
              📊 GPA: {edu.gpa}
            </span>
          </div>
          
          {edu.courses && (
            <div>
              <h4 className="text-lg font-semibold text-white mb-2">Relevant Courses:</h4>
              <div className="flex flex-wrap gap-2">
                {edu.courses.map((course, i) => (
                  <span 
                    key={i} 
                    className="bg-purple-600/20 text-purple-300 px-2 py-1 rounded text-xs transition-all"
                    onMouseEnter={(e) => {
                      e.currentTarget.style.border = '1px solid white';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.border = 'none';
                    }}
                  >
                    {course}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  </div>
  );

  return (
    <div className="min-h-screen text-white">
      <div className="container mx-auto px-6 py-12">
        <div className="space-y-20">
          
          {activeTab === 'home' && (
            <div>
              {renderHeroSection()}
              {renderGitHubContributions()}
              {renderAboutMeSection()}
              {renderEducationSection()}
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