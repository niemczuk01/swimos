export type Standard = 'B' | 'BB' | 'A' | 'AA' | 'AAA' | 'AAAA'

export type CourseType = 'SCY' | 'SCM' | 'LCM'

export interface StandardTime {
  standard: Standard
  time: string
  seconds: number
}

export interface EventStandards {
  event: string
  course: CourseType
  gender: 'M' | 'F'
  ageGroup: string
  standards: StandardTime[]
}

// Helper to convert time string to seconds
export function timeToSeconds(time: string): number {
  if (time.includes(':')) {
    const [mins, secs] = time.split(':')
    return parseInt(mins) * 60 + parseFloat(secs)
  }
  return parseFloat(time)
}

// Helper to get standard achieved for a given time
export function getStandardAchieved(
  timeStr: string,
  event: string,
  course: CourseType,
  gender: 'M' | 'F',
  ageGroup: string
): Standard | null {
  const swimSeconds = timeToSeconds(timeStr)
  const eventStandards = pvsStandards.find(
    (s) => s.event === event && s.course === course && s.gender === gender && s.ageGroup === ageGroup
  )
  if (!eventStandards) return null

  const standardOrder: Standard[] = ['B', 'BB', 'A', 'AA', 'AAA', 'AAAA']

  // Find the highest standard where the swim time is faster (lower) than the cut
  let highest: Standard | null = null
  for (const s of eventStandards.standards) {
    if (swimSeconds <= s.seconds) {
      const currentIndex = standardOrder.indexOf(s.standard)
      const highestIndex = highest ? standardOrder.indexOf(highest) : -1
      if (currentIndex > highestIndex) {
        highest = s.standard
      }
    }
  }

  return highest
}
// PVS Standards — SCY 11-12 Boys
export const pvsStandards: EventStandards[] = [
  {
    event: '50m Freestyle',
    course: 'SCY',
    gender: 'M',
    ageGroup: '11-12',
    standards: [
      { standard: 'B',    time: '31.09', seconds: 31.09 },
      { standard: 'BB',   time: '28.99', seconds: 28.99 },
      { standard: 'A',    time: '27.39', seconds: 27.39 },
      { standard: 'AA',   time: '25.79', seconds: 25.79 },
      { standard: 'AAA',  time: '24.59', seconds: 24.59 },
      { standard: 'AAAA', time: '23.49', seconds: 23.49 },
    ]
  },
  {
    event: '100m Freestyle',
    course: 'SCY',
    gender: 'M',
    ageGroup: '11-12',
    standards: [
      { standard: 'B',    time: '1:08.09', seconds: 68.09 },
      { standard: 'BB',   time: '1:03.49', seconds: 63.49 },
      { standard: 'A',    time: '59.89',   seconds: 59.89 },
      { standard: 'AA',   time: '56.39',   seconds: 56.39 },
      { standard: 'AAA',  time: '53.79',   seconds: 53.79 },
      { standard: 'AAAA', time: '51.39',   seconds: 51.39 },
    ]
  },
  {
    event: '200m Freestyle',
    course: 'SCY',
    gender: 'M',
    ageGroup: '11-12',
    standards: [
      { standard: 'B',    time: '2:28.09', seconds: 148.09 },
      { standard: 'BB',   time: '2:18.49', seconds: 138.49 },
      { standard: 'A',    time: '2:10.79', seconds: 130.79 },
      { standard: 'AA',   time: '2:03.09', seconds: 123.09 },
      { standard: 'AAA',  time: '1:57.49', seconds: 117.49 },
      { standard: 'AAAA', time: '1:52.29', seconds: 112.29 },
    ]
  },
  {
    event: '100m Backstroke',
    course: 'SCY',
    gender: 'M',
    ageGroup: '11-12',
    standards: [
      { standard: 'B',    time: '1:17.09', seconds: 77.09 },
      { standard: 'BB',   time: '1:11.79', seconds: 71.79 },
      { standard: 'A',    time: '1:07.69', seconds: 67.69 },
      { standard: 'AA',   time: '1:03.59', seconds: 63.59 },
      { standard: 'AAA',  time: '1:00.49', seconds: 60.49 },
      { standard: 'AAAA', time: '57.79',   seconds: 57.79 },
    ]
  },
  {
    event: '100m Breaststroke',
    course: 'SCY',
    gender: 'M',
    ageGroup: '11-12',
    standards: [
      { standard: 'B',    time: '1:24.09', seconds: 84.09 },
      { standard: 'BB',   time: '1:17.99', seconds: 77.99 },
      { standard: 'A',    time: '1:13.49', seconds: 73.49 },
      { standard: 'AA',   time: '1:08.99', seconds: 68.99 },
      { standard: 'AAA',  time: '1:05.69', seconds: 65.69 },
      { standard: 'AAAA', time: '1:02.79', seconds: 62.79 },
    ]
  },
  {
    event: '100m Butterfly',
    course: 'SCY',
    gender: 'M',
    ageGroup: '11-12',
    standards: [
      { standard: 'B',    time: '1:17.09', seconds: 77.09 },
      { standard: 'BB',   time: '1:11.09', seconds: 71.09 },
      { standard: 'A',    time: '1:06.79', seconds: 66.79 },
      { standard: 'AA',   time: '1:02.49', seconds: 62.49 },
      { standard: 'AAA',  time: '59.49',   seconds: 59.49 },
      { standard: 'AAAA', time: '56.79',   seconds: 56.79 },
    ]
  },
  {
    event: '200m IM',
    course: 'SCY',
    gender: 'M',
    ageGroup: '11-12',
    standards: [
      { standard: 'B',    time: '2:48.09', seconds: 168.09 },
      { standard: 'BB',   time: '2:36.99', seconds: 156.99 },
      { standard: 'A',    time: '2:28.49', seconds: 148.49 },
      { standard: 'AA',   time: '2:19.99', seconds: 139.99 },
      { standard: 'AAA',  time: '2:13.29', seconds: 133.29 },
      { standard: 'AAAA', time: '2:07.29', seconds: 127.29 },
    ]
  },
]