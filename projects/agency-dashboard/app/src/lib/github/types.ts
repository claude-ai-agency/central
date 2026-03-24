export interface GitHubFile {
  name: string
  path: string
  sha: string
  type: 'file' | 'dir'
  download_url: string | null
}

export interface GitHubContent {
  content: string // base64 encoded
  encoding: 'base64'
  path: string
  sha: string
}

export interface RateLimitInfo {
  limit: number
  remaining: number
  reset: number // Unix timestamp
  used: number
}
