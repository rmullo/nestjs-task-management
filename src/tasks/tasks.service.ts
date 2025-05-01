import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(Task)
        private taskRepository: Repository<Task>,
    ) {}

    async getAllTasks(): Promise<Task[]> {
        return await this.taskRepository.find();
    }

    async getTasksWithFilters(filterDto: GetTasksFilterDto): Promise<Task[]> {
        const { status, search } = filterDto;
    
        const query = this.taskRepository.createQueryBuilder('task');
    
        if (status) {
            query.andWhere('task.status = :status', { status });
        }
    
        if (search) {
            query.andWhere(
                '(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))',
                { search: `%${search}%` },
            );
        }
    
        const tasks = await query.getMany();

        if (!tasks.length) {
            throw new NotFoundException('Tasks not found');
        }
        return tasks;
    }

    async getTaskById(id: number): Promise<Task> {
        const found = await this.taskRepository.findOne({where: {id}});    

        if (!found) {
            throw new NotFoundException(`Task with ID "${id}" not found`);
        }

        return found;
    }

    async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
        const { title, description } = createTaskDto;

        const task = await this.taskRepository.create({
            title,
            description,
            status: TaskStatus.OPEN
        });

        await this.taskRepository.save(task);
        return task;
    }

    async deleteTaskById(id: number): Promise<void> {
        const found = await this.getTaskById(id)[0];
        await this.taskRepository.remove(found);
    }

    async updateTaskStatus(id: number, status: TaskStatus): Promise<Task> {
        let task = await this.getTaskById(id);
        console.log(task);
        console.log(status);
        task.status = status;
        await this.taskRepository.save(task);
        
        return task;
    }   
}
