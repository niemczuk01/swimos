export interface HytekTime {
  name: string
  event: string
  course: string
  time: string
  date: string
  meet: string
}

// Convert Hytek event code to our event format
function parseEvent(eventCode: string, distance: string, stroke: string): string {
  const strokeMap: Record<string, string> = {
    'A': 'Freestyle',
    'B': 'Backstroke',
    'C': 'Breaststroke',
    'D': 'Butterfly',
    'E': 'IM',
  }

  const strokeName = strokeMap[stroke] || 'Freestyle'
  return `${distance}m ${strokeName}`
}

// Convert Hytek course code
function parseCourse(courseCode: string): string {
  const courseMap: Record<string, string> = {
    'Y': 'SCY',
    'S': 'SCM',
    'L': 'LCM',
  }
  return courseMap[courseCode] || 'SCY'
}

// Convert Hytek time format (e.g. "4872" = 48.72, "14930" = 1:49.30)
function parseTime(rawTime: string): string {
  const t = rawTime.trim().replace(/^0+/, '')
  if (!t || t === '0') return ''
  
  const padded = t.padStart(6, '0')
  const mins = parseInt(padded.slice(0, -4))
  const secs = padded.slice(-4, -2)
  const hundredths = padded.slice(-2)
  
  if (mins > 0) {
    return `${mins}:${secs}.${hundredths}`
  }
  return `${parseInt(secs)}.${hundredths}`
}

// Parse date from Hytek format (MMDDYYYY)
function parseDate(rawDate: string): string {
  if (!rawDate || rawDate.trim().length < 8) return ''
  const d = rawDate.trim()
  const month = d.slice(0, 2)
  const day = d.slice(2, 4)
  const year = d.slice(4, 8)
  return `${year}-${month}-${day}`
}

// Main parser function
export function parseHytekFile(content: string): HytekTime[] {
  const lines = content.split('\n')
  const results: HytekTime[] = []
  
  let currentName = ''
  let meetName = 'Imported Meet'
  let meetDate = ''

  for (const line of lines) {
    // Meet record - get meet name
    if (line.startsWith('C1')) {
      const name = line.slice(2, 32).trim()
      if (name) meetName = name
    }

    // Meet date
    if (line.startsWith('C2')) {
      const date = line.slice(2, 10).trim()
      if (date) meetDate = parseDate(date)
    }

    // Athlete record - get swimmer name
    if (line.startsWith('D0')) {
      const last = line.slice(2, 20).trim()
      const first = line.slice(20, 35).trim()
      currentName = `${first} ${last}`.trim()
    }

    // Individual result record
    if (line.startsWith('E0')) {
      const courseCode = line.slice(2, 3).trim()
      const distance = line.slice(3, 7).trim()
      const stroke = line.slice(7, 8).trim()
      const rawTime = line.slice(8, 16).trim()
      const rawDate = line.slice(16, 24).trim()

      const course = parseCourse(courseCode)
      const event = parseEvent('', distance, stroke)
      const time = parseTime(rawTime)
      const date = rawDate ? parseDate(rawDate) : meetDate

      if (time && event && currentName) {
        results.push({
          name: currentName,
          event,
          course,
          time,
          date: date || new Date().toISOString().split('T')[0],
          meet: meetName,
        })
      }
    }
  }

  return results
}