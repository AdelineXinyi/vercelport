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

    return NextResponse.json(data);
    
  } catch (error) {
    console.error('GitHub API error:', error);
    return NextResponse.json(
      { message: 'Failed to fetch GitHub data' },
      { status: 500 }
    );
  }
}
