import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.scss']
})
export class AdminPanelComponent {
  tasks: Task[] = this.loadTasks();
  newTaskName = '';

  getTodayKey(): string {
    const today = new Date().toISOString().split('T')[0];
    return `kid-tasks-${today}`;
  }

  loadTasks(): Task[] {
    const saved = localStorage.getItem(this.getTodayKey());
    return saved ? JSON.parse(saved) : [];
  }

  saveTasks(): void {
    localStorage.setItem(this.getTodayKey(), JSON.stringify(this.tasks));
  }

  addTask(): void {
    if (!this.newTaskName.trim()) return;
    this.tasks.push({ name: this.newTaskName.trim(), done: false });
    this.newTaskName = '';
    this.saveTasks();
  }

  removeTask(index: number): void {
    this.tasks.splice(index, 1);
    this.saveTasks();
  }

  addSubtask(index: number): void {
    const name = prompt('Enter subtask name:');
    if (!name) return;
    if (!this.tasks[index].subtasks) this.tasks[index].subtasks = [];
    this.tasks[index].subtasks!.push({ name, done: false });
    this.saveTasks();
  }

  removeSubtask(taskIndex: number, subIndex: number): void {
    this.tasks[taskIndex].subtasks?.splice(subIndex, 1);
    this.saveTasks();
  }
}
