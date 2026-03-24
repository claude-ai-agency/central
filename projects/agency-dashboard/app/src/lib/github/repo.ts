import 'server-only'
import { githubRest } from './client'
import type { GitHubContent, GitHubFile, RateLimitInfo } from './types'

const ORG = process.env.GITHUB_ORG ?? 'claude-ai-agency'
const REPO = process.env.GITHUB_REPO ?? 'central'

export async function getFileContent(path: string): Promise<string> {
  const data = await githubRest<GitHubContent>(
    `/repos/${ORG}/${REPO}/contents/${path}`
  )
  return Buffer.from(data.content, 'base64').toString('utf-8')
}

export async function listDirectory(path: string): Promise<GitHubFile[]> {
  return githubRest<GitHubFile[]>(
    `/repos/${ORG}/${REPO}/contents/${path}`
  )
}

export async function getRateLimit(): Promise<RateLimitInfo> {
  const data = await githubRest<{ rate: RateLimitInfo }>('/rate_limit')
  return data.rate
}
