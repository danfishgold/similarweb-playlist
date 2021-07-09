import {
  parse as parseDuration,
  toSeconds as durationToSeconds,
} from 'iso8601-duration'
import { Song } from 'shared/src/playlist'
import { v4 as uuid } from 'uuid'

type ApiRepsonse<Item> = { error: string } | { items: Item[] }

type VideoItem = {
  id: string
  snippet: {
    title: string
    thumbnails: { medium: { url: string; width: number; height: number } }
  }
  contentDetails: { duration: string }
}

type SearchItem = {
  id: { videoId: string }
}

// Query parsing

const videoIdRegex = /^[A-Za-z0-9_-]{11}$/

function parseVideoId(inputValue: string): string | null {
  try {
    const url = new URL(inputValue)
    switch (url.host) {
      case 'www.youtube.com': {
        if (url.pathname !== '/watch') {
          return null
        }
        return url.searchParams.get('v')
      }
      case 'www.youtu.be': {
        if (!videoIdRegex.test(url.pathname.slice(1))) {
          return null
        }

        return url.pathname.slice(1)
      }
      default: {
        return null
      }
    }
  } catch {
    if (!videoIdRegex.test(inputValue)) {
      return null
    }

    return inputValue
  }
}

// API Requests

const apiKey = process.env.REACT_APP_YOUTUBE_DATA_API_KEY

const searchUrl = (query: string) =>
  `https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${query}&key=${apiKey}`

const videoDetailsUrl = (videoId: string) =>
  `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${apiKey}&part=snippet,contentDetails`

export default async function fetchSongForVideoIdOrSearchQuery(
  input: string,
): Promise<Song> {
  const videoId = parseVideoId(input) ?? (await fetchVideoIdForQuery(input))
  return await fetchSongFromId(videoId)
}

async function fetchVideoIdForQuery(query: string): Promise<string> {
  const response = await fetch(searchUrl(query))
  const json = await response.json()

  return parseVideoIdFromSearchJson(json)
}

async function fetchSongFromId(videoId: string): Promise<Song> {
  const response = await fetch(videoDetailsUrl(videoId))
  const json = await response.json()

  return parseSongFromVideoJson(json)
}
// API Response parsing

function parseVideoIdFromSearchJson(response: ApiRepsonse<SearchItem>): string {
  if ('error' in response) {
    throw new Error(response.error)
  }

  if (response.items.length !== 1) {
    throw new Error(`Got ${response.items.length} items from YouTube`)
  }

  return response.items[0].id.videoId
}

function parseSongFromVideoJson(response: ApiRepsonse<VideoItem>): Song {
  if ('error' in response) {
    throw new Error(response.error)
  }

  if (response.items.length !== 1) {
    throw new Error(`Got ${response.items.length} items from YouTube`)
  }

  const item = response.items[0]
  const duration = durationToSeconds(
    parseDuration(item.contentDetails.duration),
  )

  return {
    videoId: item.id,
    title: trimTitle(item.snippet.title),
    thumbnail: item.snippet.thumbnails.medium,
    durationInSeconds: duration,
    id: uuid(),
  }
}

function trimTitle(title: string): string {
  return title.replace(
    // eslint-disable-next-line no-useless-escape
    /\s*[\(\[](audio|video|official audio|official video)[\)\]]\s*$/i,
    '',
  )
}
