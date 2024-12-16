import { describe } from 'vitest'
import { fireEvent, render, screen }from '@testing-library/react'
import '@testing-library/jest-dom'
import App from '../App'

describe('A truthy statement', () => {
  beforeEach(()=>{
    render(<App></App>)
  })

  test("Show title", ()=>{
    expect(screen.getByRole('heading')).toHaveTextContent("Date Picker")
  })

  test("Show current date", ()=>{
    const date = new Date()
    const currentMonth = date.getMonth() + 1;
    const currentYear = date.getFullYear();
    expect(screen.getByTestId("date-header")).toHaveTextContent(`${currentYear}年${currentMonth}月`)
  })

  test('Renders correct days for the month', () => {
    const today = new Date().getDate();

    const dateItems = screen.getAllByRole('listitem');
    const todayItem = screen.getByText(today.toString());

    expect(todayItem).toHaveClass('today');
    expect(dateItems).toHaveLength(35); 
  });

  test('Should highlight selected date range', () => {
    const activeDate = screen.getByText(10); 
    
    fireEvent.click(activeDate); 
    expect(activeDate).toHaveClass('selected')

    const selectedRange = screen.getByTestId("date-select-range")
    expect(selectedRange).toHaveTextContent('2024 年 12 月 10 日 -');

    const endDate = screen.getByText(15);
    fireEvent.click(endDate);

    expect(selectedRange).toHaveTextContent('2024 年 12 月 10 日 - 2024 年 12 月 15 日');
  });

  test("Inactive date should disabled clicking event", ()=>{
    const inactiveDate = screen.getAllByTestId("inactive-date")
    const selectedRange = screen.getByTestId("date-select-range")
    inactiveDate.forEach((date)=>{
      fireEvent.click(date)
      expect(selectedRange).toHaveTextContent("")
    })
  })

  test("Reset selected date", ()=>{
    const activeDate = screen.getByText(10);  
    const endDate = screen.getByText(15);
    const selectedRange = screen.getByTestId("date-select-range")
    fireEvent.click(activeDate); 
    fireEvent.click(endDate);
    expect(selectedRange).toHaveTextContent('2024 年 12 月 10 日 - 2024 年 12 月 15 日');

    const newDate = screen.getByText(13)
    fireEvent.click(newDate)
    expect(selectedRange).toHaveTextContent('2024 年 12 月 13 日 -');
  })
})