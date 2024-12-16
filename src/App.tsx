import { useEffect, useState } from 'react'
import './App.css'

interface DateType{
  status:'active'|'inactive',
  today?:boolean,
  date:number
}
interface SelectedDate{
  start:number,
  end:number
}

function App() {
  const date = new Date()
  const currentDate = date.getDate()
  const currentYear = date.getFullYear()
  const currentMonth = date.getMonth()+1
  const [days, setDays] = useState<DateType[]>([])
  const [selectedDate, setSelectedDate] = useState<SelectedDate>({start:0,end:0})

  useEffect(()=>{
    const daysArr:DateType[] = []

    // Date的月份是0為基底，currentMonth要-1
    const currentMonthStartWeekDay = new Date(currentYear, currentMonth-1, 1).getDay()
    const prevMonthLastDay = new Date(currentYear, currentMonth-1, 0).getDate()
    // 取得最後一天，當前currentMonth在Date裡其實是下一個月，但是0會返回去找上一個月最後一天
    const currentMonthLastDay = new Date(currentYear, currentMonth, 0).getDate()
    const currentMonthLastWeekDay=  new Date(currentYear, currentMonth, 0).getDay()

    if(currentMonthStartWeekDay !== 0){
      for(let i = currentMonthStartWeekDay; i>0; i--){
        daysArr.push({status:'inactive', date:prevMonthLastDay-i+1})
      }
    }
    for(let i =1;i<=currentMonthLastDay; i++){
      daysArr.push({status:'active',today:i===currentDate?true:false, date:i})
    }

    if(currentMonthLastWeekDay !== 6){
      for(let i = 1; i<7-currentMonthLastWeekDay; i++){
        daysArr.push({status:'inactive', date:i})
      }
    }

    setDays([...daysArr.slice(0,35)])
  },[currentYear, currentMonth,currentDate])
  const handleSelect = (date:number, status:string)=>{
    if(status !== 'active'){
      return
    }
    if (selectedDate.start === 0|| date < selectedDate.start || (selectedDate.start !==0 && selectedDate.end !== 0)) {
      // 設定新的開始日期
      setSelectedDate({ start: date, end: 0 });
    } else {
      // 設定結束日期
      setSelectedDate({ start: selectedDate.start, end: date });
    }
  }
  return (
    <>
      <h1>Date Picker</h1>
      <div className="date-wrapper">
        <header className='date-header'>
          <div className='date-select-btn'>＜</div>
          <div data-testid='date-header'>{currentYear}年{currentMonth}月</div>
          <div className='date-select-btn'>＞</div>
        </header>
        <div>
          <ul className='date-day-wrapper'>
            {days.map((date, index)=> <li data-testid={`${date.status === 'inactive' ?"inactive-date":""}`} className={`date-day ${date.status} ${date.today?'today':""} ${(selectedDate.start === date.date || (selectedDate.start<=date.date && date.date<=selectedDate.end))?'selected':""}`} key={index} onClick={()=>{handleSelect(date.date, date.status)}}>{date.date}</li>)}
          </ul>
        </div>
        <div data-testid = "date-select-range" className='date-select-range'>
          {selectedDate.start !== 0 && `${currentYear} 年 ${currentMonth} 月 ${selectedDate.start} 日 - `}{selectedDate.end !== 0 && `${currentYear} 年 ${currentMonth} 月 ${selectedDate.end} 日`} </div>
      </div>
    </>
  )
}

export default App
