import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-monthly-report',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './monthly-report.component.html',
  styleUrls: ['./monthly-report.component.scss']
})
export class MonthlyReportComponent implements OnInit {
  days: { date: string; reward: boolean }[] = [];
  month = '';
  totalStars = 0;
  totalCoins = 0;

  ngOnInit(): void {
    const now = new Date();
    this.month = now.toLocaleString('default', { month: 'long' });

    const year = now.getFullYear();
    const monthIndex = now.getMonth();
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, monthIndex, day);
      const dateStr = date.toISOString().split('T')[0];
      const earned = localStorage.getItem(`reward-earned-${dateStr}`) === 'true';

      this.days.push({ date: dateStr, reward: earned });
      if (earned) {
        this.totalStars += 3;
        this.totalCoins += 30;
      }
    }
  }
}
