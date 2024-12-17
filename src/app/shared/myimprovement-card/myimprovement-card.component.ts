import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

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

  constructor(private router: Router) {}

  ngOnInit() {
    this.taskList = this.myImprovement.tasks.filter((data:any) => {return !data.isDeleted})
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
    this.completedCount = this.myImprovement?.taskReport?.completed || 0;
  }

  calculateProgress(): void {
    const totalTasks = this.myImprovement?.taskReport?.total ?? 0;
    const completedCount = this.completedCount ?? 0;

    if (totalTasks === 0) {
      this.progressValue = 0;
      return;
    }

    if (completedCount === totalTasks) {
      this.progressValue = this.myImprovement?.isreflected ? 100 : 99;
    } else {
      this.progressValue = Math.round((completedCount / totalTasks) * 100);
    }
  }

  onImprovement(id:any) {
    this.router.navigate(['project-details'], { state: { _id: id } });
  }
}