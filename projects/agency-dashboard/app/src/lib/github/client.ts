import 'server-only'

const GITHUB_API = 'https://api.github.com'
const GITHUB_GRAPHQL = 'https://api.github.com/graphql'

function getToken(): string {
  const token = process.env.GITHUB_TOKEN
  if (!token) throw new Error('GITHUB_TOKEN not set')
  return token
}

export async function githubRest<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`${GITHUB_API}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${getToken()}`,
      Accept: 'application/vnd.github.v3+json',
      'X-GitHub-Api-Version': '2022-11-28',
      ...options?.headers,
    },
    next: { revalidate: 300 }, // 5min cache per ADR-001
  })

  if (!res.ok) {
    throw new Error(`GitHub REST error: ${res.status} ${res.statusText} — ${path}`)
  }

  return res.json() as Promise<T>
}

export async function githubGraphQL<T>(
  query: string,
  variables?: Record<string, unknown>
): Promise<T> {
  const res = await fetch(GITHUB_GRAPHQL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getToken()}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 300 },
  })

  if (!res.ok) {
    throw new Error(`GitHub GraphQL error: ${res.status} ${res.statusText}`)
  }

  const json = (await res.json()) as { data?: T; errors?: { message: string }[] }

  if (json.errors?.length) {
    throw new Error(`GitHub GraphQL errors: ${json.errors.map((e) => e.message).join(', ')}`)
  }

  if (!json.data) {
    throw new Error('GitHub GraphQL returned no data')
  }

  return json.data
}
