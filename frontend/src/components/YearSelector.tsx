// components/YearSelector.tsx
import { useEffect, useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

const TypedDatePicker = DatePicker as unknown as React.FC<any>

const YearSelector = () => {
  const [selectedDate, setSelectedDate] = useState(() => {
    const stored = localStorage.getItem('selectedYear')
    return stored ? new Date(parseInt(stored), 0, 1) : new Date()
  })

  const fetchRecords = async () => {
    try {
      const token = localStorage.getItem('token') // JWT token stored in localStorage or state
      const response = await fetch('http://localhost:8000/api/records', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`, // Pass JWT token in Authorization header
          'Accept': 'application/json',
          'Year': selectedDate.getFullYear().toString(),
        },
      })
  
      if (!response.ok) {
        throw new Error('Something went wrong')
      }
  
      const data = await response.json()
      console.log('Fetched Records:', data)
      return data
    } catch (error) {
      console.error('Fetch failed:', error)
      return []
    }
  }
      

  useEffect(() => {
    localStorage.setItem('selectedYear', selectedDate.getFullYear().toString())
  }, [selectedDate])
  return (
    <div className="flex flex-col gap-1 w-fit">
      <Label htmlFor="year-picker">Working Year</Label>
      <button onClick={fetchRecords}>Test year return</button>
      <TypedDatePicker
        id="year-picker"
        selected={selectedDate}
        onChange={(date) => date && setSelectedDate(date)}
        showYearPicker
        dateFormat="yyyy"
        className={cn(
          'w-[120px] px-3 py-2 text-sm border border-input bg-background rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring'
        )}
      />
    </div>
  )
}

export default YearSelector
