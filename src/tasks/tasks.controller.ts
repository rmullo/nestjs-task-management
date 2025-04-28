import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { get } from 'http';
import { Task, TaskStatus } from './task.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';

@Controller('tasks')
export class TasksController {
    constructor(private tasksService: TasksService) {}

    @Get()
    getTasks(
        @Query(ValidationPipe) filterDto: GetTasksFilterDto
    ): Task[] {
        return this.tasksService.getTasksWithFilters(filterDto);
    }

    @Get('/:id')
    getTaskById(
        @Param('id') id: string,
    ): Task|undefined {
        return this.tasksService.getTaskById(id);
    }

    @Post()
    @UsePipes(ValidationPipe)
    createTask(
        @Body() createTaskDto: CreateTaskDto,
    ): Task {
        return this.tasksService.createTask(createTaskDto);
    }

    @Delete('/:id')
    @HttpCode(204)
    deleteTaskById(
        @Param('id') id: string,
    ): void {
        this.tasksService.deleteTaskById(id);
    }

    @Patch('/:id/status')
    updateTaskStatus(
        @Param('id') id: string,
        @Body('status', TaskStatusValidationPipe) status: TaskStatus,
    ): Task | undefined {
        return this.tasksService.updateTaskStatus(id, status); 
    }
}
