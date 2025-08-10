import { NextResponse } from 'next/server';
export async function GET() {
  try {
    const username = process.env.NEXT_PUBLIC_GITHUB_USERNAME || 'AdelineXinyi';
    const token = process.env.GITHUB_TOKEN; // 从服务器环境变量获取

    if (!token) {
      return NextResponse.json(
        { message: 'GitHub token not configured' },
        { status: 500 }
      );
    }

    const query = `
      query($userName: String!) {
        user(login: $userName) {
          contributionsCollection {
            contributionCalendar {
              totalContributions
              weeks {
                contributionDays {
                  contributionCount
                  date
                  weekday
                }
              }
            }
          }
        }
      }
    `;

    const response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'User-Agent': 'NextJS-Portfolio-App'
      },
      body: JSON.stringify({
        query,
        variables: { userName: username }
      })
    });

    const data = await response.json();

    if (data.errors) {
      return NextResponse.json(
        { message: 'GraphQL errors', errors: data.errors },
        { status: 400 }
      );
    }


    if (process.env.NODE_ENV === 'development') {
      const fs = require('fs');
      const path = require('path');
      
      // 提取并压缩贡献数据 - 只保存非零贡献
      const compressedContributions: {[key: string]: number} = {};
      
      data.data.user.contributionsCollection.contributionCalendar.weeks.forEach((week: any) => {
        week.contributionDays.forEach((day: any) => {
          if (day.contributionCount > 0) {
            compressedContributions[day.date] = day.contributionCount;
          }
        });
      });
      
      // 导出压缩格式到 public 目录
      fs.writeFileSync(
        path.join(process.cwd(), 'public/github-contributions.json'),
        JSON.stringify(compressedContributions, null, 2)
      );
    }
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('GitHub API error:', error);
    return NextResponse.json(
      { message: 'Failed to fetch GitHub data' },
      { status: 500 }
    );
  }
}
