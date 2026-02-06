'use client'

import type { HeatmapDay } from '@/lib/types'

interface ContributionHeatmapProps {
  data: HeatmapDay[]
}

export function ContributionHeatmap({ data }: ContributionHeatmapProps) {
  const days: string[] = []
  for (let i = 89; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    days.push(date.toISOString().split('T')[0])
  }

  const dayMap: Record<string, { intensity: number; color: string }> = {}
  data.forEach(d => {
    const existing = dayMap[d.day]
    if (!existing || d.total_intensity > existing.intensity) {
      dayMap[d.day] = {
        intensity: d.total_intensity,
        color: d.project_color
      }
    }
  })

  function getIntensityClass(intensity: number): string {
    if (intensity === 0) return 'bg-[#1a1a1a]'
    if (intensity <= 2) return 'bg-[#0e4429]'
    if (intensity <= 5) return 'bg-[#006d32]'
    if (intensity <= 10) return 'bg-[#26a641]'
    return 'bg-[#39d353]'
  }

  const weeks: string[][] = []
  let currentWeek: string[] = []

  const firstDay = new Date(days[0])
  const firstDayOfWeek = firstDay.getDay()

  for (let i = 0; i < firstDayOfWeek; i++) {
    currentWeek.push('')
  }

  days.forEach(day => {
    currentWeek.push(day)
    if (currentWeek.length === 7) {
      weeks.push(currentWeek)
      currentWeek = []
    }
  })

  if (currentWeek.length > 0) {
    weeks.push(currentWeek)
  }

  const dayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

  return (
    <div className="bg-[#111] border border-[#333] rounded-lg p-4">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-xs text-gray-500 uppercase tracking-wide">Contribution Activity</h3>
        <span className="text-xs text-gray-600">Last 90 days</span>
      </div>

      <div className="flex gap-1">
        <div className="flex flex-col gap-[3px] text-xs text-gray-600 mr-1">
          {dayLabels.map((label, i) => (
            <div key={i} className="h-[10px] flex items-center">
              {i % 2 === 1 ? label : ''}
            </div>
          ))}
        </div>

        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="flex flex-col gap-[3px]">
            {week.map((day, dayIndex) => {
              if (!day) {
                return <div key={dayIndex} className="w-[10px] h-[10px]" />
              }

              const dayData = dayMap[day]
              const intensity = dayData?.intensity || 0

              return (
                <div
                  key={dayIndex}
                  className={`w-[10px] h-[10px] rounded-sm ${getIntensityClass(intensity)} cursor-pointer transition-transform hover:scale-125`}
                  title={`${day}: ${intensity} activity`}
                />
              )
            })}
          </div>
        ))}
      </div>

      <div className="flex items-center justify-end gap-2 mt-4 text-xs text-gray-600">
        <span>Less</span>
        <div className="flex gap-[3px]">
          <div className="w-[10px] h-[10px] rounded-sm bg-[#1a1a1a]" />
          <div className="w-[10px] h-[10px] rounded-sm bg-[#0e4429]" />
          <div className="w-[10px] h-[10px] rounded-sm bg-[#006d32]" />
          <div className="w-[10px] h-[10px] rounded-sm bg-[#26a641]" />
          <div className="w-[10px] h-[10px] rounded-sm bg-[#39d353]" />
        </div>
        <span>More</span>
      </div>
    </div>
  )
}
