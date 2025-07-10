'use client';

import React, { useState, useEffect } from 'react';
import { Mail, Linkedin, Github, ExternalLink, MapPin, User, Briefcase, Code, Globe, BookOpen } from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState<string>('home');

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-6xl mx-auto">
          {/* 个人信息 */}
          <div className="text-center mb-20">
            <h1 className="text-5xl font-bold text-white mb-4">Xinyi Li</h1>
            <p className="text-xl text-gray-300 mb-8">Software Engineer & Full-Stack Developer</p>
            
            {/* 导航按钮 - 使用内联样式测试 */}
            <div className="flex justify-center gap-4 mb-12">
              <button 
                onClick={() => setActiveTab('home')}
                className="px-6 py-3 rounded-lg transition-all duration-300 bg-purple-600 text-white hover:scale-105"
                style={{backgroundColor: activeTab === 'home' ? '#7c3aed' : '#4b5563'}}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#7c3aed';
                  e.currentTarget.style.border = '2px solid white';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = activeTab === 'home' ? '#7c3aed' : '#4b5563';
                  e.currentTarget.style.border = 'none';
                }}
              >
                🏠 Home
              </button>
              <button 
                onClick={() => setActiveTab('projects')}
                className="px-6 py-3 rounded-lg transition-all duration-300 bg-blue-600 text-white hover:scale-105"
                style={{backgroundColor: activeTab === 'projects' ? '#2563eb' : '#4b5563'}}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#2563eb';
                  e.currentTarget.style.border = '2px solid white';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = activeTab === 'projects' ? '#2563eb' : '#4b5563';
                  e.currentTarget.style.border = 'none';
                }}
              >
                💼 Projects
              </button>
              <button 
                onClick={() => setActiveTab('resume')}
                className="px-6 py-3 rounded-lg transition-all duration-300 bg-green-600 text-white hover:scale-105"
                style={{backgroundColor: activeTab === 'resume' ? '#16a34a' : '#4b5563'}}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#16a34a';
                  e.currentTarget.style.border = '2px solid white';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = activeTab === 'resume' ? '#16a34a' : '#4b5563';
                  e.currentTarget.style.border = 'none';
                }}
              >
                📄 Resume
              </button>
            </div>
            
            {/* 测试卡片 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gray-800 p-6 rounded-xl transition-all duration-300 hover:bg-gray-700 hover:scale-105 hover:shadow-xl ring-2 ring-transparent hover:ring-white">
                <h3 className="text-xl font-bold mb-3">About Me</h3>
                <p className="text-gray-300">Passionate software engineer with full-stack development experience.</p>
              </div>
              
              <div className="bg-gray-800 p-6 rounded-xl transition-all duration-300 hover:bg-gray-700 hover:scale-105 hover:shadow-xl ring-2 ring-transparent hover:ring-white">
                <h3 className="text-xl font-bold mb-3">Skills</h3>
                <p className="text-gray-300">React, Node.js, Python, TypeScript, and modern web technologies.</p>
              </div>
              
              <div className="bg-gray-800 p-6 rounded-xl transition-all duration-300 hover:bg-gray-700 hover:scale-105 hover:shadow-xl ring-2 ring-transparent hover:ring-white">
                <h3 className="text-xl font-bold mb-3">Experience</h3>
                <p className="text-gray-300">Software engineering internships and research experience.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}