import { Component } from '@angular/core';
import { TaskListComponent } from './components/task-list/task-list.component';
import { AdminPanelComponent } from './components/admin-panel/admin-panel.component';
import { CommonModule } from '@angular/common';
import { MonthlyReportComponent } from './components/monthly-report/monthly-report.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, TaskListComponent, AdminPanelComponent, MonthlyReportComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  isParentMode = false;

  toggleMode() {
    this.isParentMode = !this.isParentMode;
  }
}
