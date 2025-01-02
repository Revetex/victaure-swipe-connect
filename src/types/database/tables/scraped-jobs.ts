export interface ScrapedJobsTable {
  Row: {
    id: string
    title: string
    company: string
    location: string
    description: string | null
    url: string | null
    posted_at: string | null
    created_at: string | null
    updated_at: string | null
  }
  Insert: {
    id?: string
    title: string
    company: string
    location: string
    description?: string | null
    url?: string | null
    posted_at?: string | null
    created_at?: string | null
    updated_at?: string | null
  }
  Update: {
    id?: string
    title?: string
    company?: string
    location?: string
    description?: string | null
    url?: string | null
    posted_at?: string | null
    created_at?: string | null
    updated_at?: string | null
  }
  Relationships: []
}