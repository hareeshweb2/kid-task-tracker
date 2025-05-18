import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import confetti from 'canvas-confetti';
import { Task } from '../../models/task.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent {



  tasks = this.loadTasks();
  rewardEarned = false;

  selectedDate: string = this.getToday(); // format: YYYY-MM-DD

  last7Days: string[] = [];


  get dailyStars(): number {
    return this.rewardEarned ? 3 : 0;
  }

  get totalStars(): number {
    return this.last7Days.filter(d => this.isRewardEarned(d)).length * 3;
  }

  get totalCoins(): number {
    return this.totalStars * 10;
  }

ngOnInit(): void {
  this.last7Days = this.getLast7Dates();
  this.rewardEarned = this.checkIfRewardAlreadyGiven(); // in case it's today
}

getLast7Dates(): string[] {
  const days: string[] = [];
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    days.push(date.toISOString().split('T')[0]);
  }
  return days;
}
isRewardEarned(date: string): boolean {
  const data = localStorage.getItem(this.getStorageKey(date));
  if (!data) return false;
  const tasks: Task[] = JSON.parse(data);
  return tasks.every(task =>
    task.subtasks ? task.subtasks.every(sub => sub.done) : task.done
  );
}
get motivationalMessage(): string {
  const streak = this.last7Days.filter(d => this.isRewardEarned(d)).length;

  if (streak === 7) return '🌟 Perfect week! You’re unstoppable!';
  if (streak >= 5) return '🔥 Great job! Keep the streak going!';
  if (streak >= 3) return '💪 You’re getting there! Stay consistent!';
  if (streak > 0) return '👏 Good start! Let’s aim higher!';
  return '🚀 Today is a great day to start your streak!';
}



  getToday(): string {
    return new Date().toISOString().split('T')[0];
  }


  loadTasks(): Task[] {
    const saved = localStorage.getItem(this.getStorageKey(this.selectedDate));
    if (saved) {
      return JSON.parse(saved);
    }
    return [
      { name: 'Shower', done: false },
      {
        name: 'Study',
        done: false,
        subtasks: [
          { name: 'Math', done: false },
          { name: 'Reading', done: false },
          { name: 'Writing', done: false },
          { name: 'Social Science', done: false },
        ]
      }
    ];
  }

  saveTasks(): void {
    localStorage.setItem(this.getStorageKey(this.selectedDate), JSON.stringify(this.tasks));
  }

  getStorageKey(date: string): string {
    return `kid-tasks-${date}`;
  }

  getTodayKey(): string {
    const today = new Date().toISOString().split('T')[0]; // e.g., 2025-05-18
    return `kid-tasks-${today}`;
  }


  toggleTask(index: number): void {

    const task = this.tasks[index];
    if (!task.subtasks) {
      task.done = !task.done;
      this.saveTasks();
      this.checkReward();
    }
  }

  toggleSubtask(taskIndex: number, subIndex: number): void {

    const subtask = this.tasks[taskIndex].subtasks?.[subIndex];
    if (subtask) {
      subtask.done = !subtask.done;
      this.saveTasks();
      this.checkReward();
    }
  }

  checkReward(): void {
    const allDone = this.tasks.every((task: any) => {
      if (task.subtasks) {
        return task.subtasks.every((sub: any) => sub.done);
      }
      return task.done;
    });

    if (allDone && !this.rewardEarned) {
      this.rewardEarned = true;
      this.launchConfetti();
      this.saveDailyReward(); // Add this line
    }
  }

  saveDailyReward(): void {
    localStorage.setItem(`reward-earned-${this.selectedDate}`, 'true');
  }


  onDateChange(): void {
    this.tasks = this.loadTasks();
    this.rewardEarned = this.checkIfRewardAlreadyGiven();
  }

  // checkIfRewardAlreadyGiven(): boolean {
  //   return this.tasks.every(task =>
  //     task.subtasks ? task.subtasks.every(sub => sub.done) : task.done
  //   );
  // }

  checkIfRewardAlreadyGiven(): boolean {
    const rewardFlag = localStorage.getItem(`reward-earned-${this.selectedDate}`);
    return rewardFlag === 'true';
  }



  launchConfetti(): void {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  }
}
