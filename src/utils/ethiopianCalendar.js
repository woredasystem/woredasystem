// Ethiopian Calendar Utility Functions

// Ethiopian months in Amharic
export const ethiopianMonths = [
  'መስከረም', 'ጥቅምት', 'ሕዳር', 'ታኅሣሥ', 'ጥር', 'የካቲት',
  'መጋቢት', 'ሚያዝያ', 'ግንቦት', 'ሰኔ', 'ሐምሌ', 'ነሐሴ', 'ጳጉሜን'
]

// Ethiopian months in English
export const ethiopianMonthsEn = [
  'Meskerem', 'Tikimt', 'Hidar', 'Tahsas', 'Tir', 'Yekatit',
  'Megabit', 'Miazia', 'Ginbot', 'Sene', 'Hamle', 'Nehase', 'Pagumen'
]

// Convert Gregorian date to Ethiopian
export function gregorianToEthiopian(date) {
  const gregorianYear = date.getFullYear()
  const gregorianMonth = date.getMonth() + 1
  const gregorianDay = date.getDate()

  // Calculate Ethiopian year
  // Ethiopian New Year is September 11 in Gregorian calendar
  // Ethiopian calendar is 7-8 years behind Gregorian
  let ethYear = gregorianYear - 7
  if (gregorianMonth < 9 || (gregorianMonth === 9 && gregorianDay < 11)) {
    ethYear--
  }

  // Find the Gregorian year that contains the Ethiopian New Year for this Ethiopian year
  // Ethiopian year X starts on September 11 of Gregorian year (X + 7)
  const ethNewYearGregYear = ethYear + 7
  
  // Calculate days from Ethiopian New Year (September 11)
  const ethNewYearDate = new Date(ethNewYearGregYear, 8, 11) // September 11
  const currentDate = new Date(gregorianYear, gregorianMonth - 1, gregorianDay)
  let daysDiff = Math.floor((currentDate - ethNewYearDate) / (1000 * 60 * 60 * 24))

  // Handle case where date is before Ethiopian New Year (shouldn't happen with correct year calculation, but just in case)
  if (daysDiff < 0) {
    ethYear--
    const newEthNewYearGregYear = ethYear + 7
    const newEthNewYearDate = new Date(newEthNewYearGregYear, 8, 11)
    daysDiff = Math.floor((currentDate - newEthNewYearDate) / (1000 * 60 * 60 * 24))
  }

  let ethMonth, ethDay
  if (daysDiff < 30) {
    ethMonth = 1
    ethDay = daysDiff + 1
  } else if (daysDiff < 60) {
    ethMonth = 2
    ethDay = daysDiff - 29
  } else if (daysDiff < 90) {
    ethMonth = 3
    ethDay = daysDiff - 59
  } else if (daysDiff < 120) {
    ethMonth = 4
    ethDay = daysDiff - 89
  } else if (daysDiff < 150) {
    ethMonth = 5
    ethDay = daysDiff - 119
  } else if (daysDiff < 180) {
    ethMonth = 6
    ethDay = daysDiff - 149
  } else if (daysDiff < 210) {
    ethMonth = 7
    ethDay = daysDiff - 179
  } else if (daysDiff < 240) {
    ethMonth = 8
    ethDay = daysDiff - 209
  } else if (daysDiff < 270) {
    ethMonth = 9
    ethDay = daysDiff - 239
  } else if (daysDiff < 300) {
    ethMonth = 10
    ethDay = daysDiff - 269
  } else if (daysDiff < 330) {
    ethMonth = 11
    ethDay = daysDiff - 299
  } else {
    ethMonth = 12
    ethDay = daysDiff - 329
  }

  return { year: ethYear, month: ethMonth, day: ethDay }
}

// Convert Ethiopian date to Gregorian
export function ethiopianToGregorian(year, month, day) {
  // Ethiopian New Year is September 11 (or 12 in leap years) in Gregorian
  // Ethiopian calendar is approximately 7-8 years behind Gregorian
  
  // Calculate the Gregorian year (Ethiopian year + 7)
  let gregorianYear = year + 7
  
  // Ethiopian months have 30 days each, except Pagumen (month 13) which has 5-6 days
  const monthDays = [30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 5]
  
  // Calculate total days from start of Ethiopian year
  let totalDays = 0
  for (let i = 0; i < month - 1; i++) {
    totalDays += monthDays[i]
  }
  totalDays += day - 1
  
  // Ethiopian New Year is September 11 in Gregorian (non-leap) or September 12 (leap)
  // We'll use a simpler approach: start from September 11 of the Gregorian year
  const baseDate = new Date(gregorianYear, 8, 11) // September 11 (month 8 = September)
  
  // Add the days
  const resultDate = new Date(baseDate)
  resultDate.setDate(resultDate.getDate() + totalDays)
  
  // Adjust year if we've crossed into next Gregorian year
  if (resultDate.getMonth() < 8 || (resultDate.getMonth() === 8 && resultDate.getDate() < 11)) {
    gregorianYear++
    const newBaseDate = new Date(gregorianYear, 8, 11)
    resultDate.setTime(newBaseDate.getTime())
    resultDate.setDate(resultDate.getDate() + totalDays)
  }
  
  return resultDate
}

// Get current Ethiopian date
export function getCurrentEthiopianDate() {
  return gregorianToEthiopian(new Date())
}

// Format Ethiopian date for display
export function formatEthiopianDate(year, month, day, lang = 'am') {
  const monthName = lang === 'am' ? ethiopianMonths[month - 1] : ethiopianMonthsEn[month - 1]
  return `${day} ${monthName} ${year}`
}

// Get days in Ethiopian month
export function getDaysInEthiopianMonth(month, year) {
  if (month === 13) {
    // Pagumen has 5 or 6 days depending on leap year
    return (year % 4 === 3) ? 6 : 5
  }
  return 30
}

// Convert international time to Ethiopian time
// Ethiopian time is 6 hours behind international time
// Ethiopian day starts at 6:00 AM international (12:00 AM Ethiopian)
export function convertToEthiopianTime(hour, minute) {
  // Subtract 6 hours from international time
  let ethHour = hour - 6
  
  // Handle day rollover (if negative, add 24)
  if (ethHour < 0) {
    ethHour += 24
  }
  
  // Convert to 12-hour format for display
  let displayHour = ethHour
  let period = ''
  
  if (ethHour === 0) {
    displayHour = 12
    period = 'ጠዋት' // Morning (midnight)
  } else if (ethHour >= 1 && ethHour <= 5) {
    period = 'ጠዋት' // Morning (1 AM - 5 AM)
  } else if (ethHour >= 6 && ethHour <= 11) {
    period = 'ከሰአት' // Afternoon (6 AM - 11 AM)
  } else if (ethHour === 12) {
    period = 'ከሰአት' // Afternoon (noon)
  } else if (ethHour >= 13 && ethHour <= 17) {
    displayHour = ethHour - 12
    period = 'ከሰአት' // Afternoon (1 PM - 5 PM)
  } else {
    displayHour = ethHour - 12
    period = 'ማታ' // Evening (6 PM - 11 PM)
  }
  
  return {
    hour: displayHour,
    minute: minute,
    period: period,
    hour24: ethHour
  }
}

