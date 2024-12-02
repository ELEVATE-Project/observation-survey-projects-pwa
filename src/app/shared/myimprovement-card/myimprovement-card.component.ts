import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-myimprovement-card',
  templateUrl: './myimprovement-card.component.html',
  styleUrls: ['./myimprovement-card.component.scss'],
})
export class MyimprovementCardComponent implements OnInit {
  @Input() myImprovement: any;
  @Input() index: any;

  taskList: any;
  completedCount: number = 0;
  progressValue: number = 0;

  filteredTasksWithIndexes: { task: any; originalIndex: number }[] = [];

  constructor() {}

  ngOnInit() {
    this.taskList = this.myImprovement.tasks;
    const tasksWithIndexes = this.taskList.map((task: any, idx: number) => ({
      task,
      originalIndex: idx,
      completed: task.status === 'completed',
    }));

    const incompleteTasks = tasksWithIndexes.filter((item:any) => !item.completed);
    const completedTasks = tasksWithIndexes.filter((item:any) => item.completed);

    this.filteredTasksWithIndexes = [...incompleteTasks, ...completedTasks]
      .slice(0, 3)
      .sort((a, b) => a.originalIndex - b.originalIndex);

    this.countCompletedTasks();
    this.calculateProgress();
  }

  countCompletedTasks() {
    this.completedCount = this.myImprovement.taskReport.completed || 0;
  }

  calculateProgress(): void {
    const totalTasks = this.myImprovement.taskReport.total;

    if (totalTasks > 0) {
      if (this.completedCount === totalTasks) {
        this.progressValue = 99;
        if (this.myImprovement.isreflected) {
          this.progressValue += 1;
        }
      } else {
        const taskCompletionPercentage = (this.completedCount / totalTasks) * 99;
        this.progressValue = Math.floor(Math.min(taskCompletionPercentage, 99));
      }
    } else {
      this.progressValue = 0;
    }
  }

  onImprovement(id:any) {
    console.log("redirection to the objective");
  }
}