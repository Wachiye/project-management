package com.egerton.projectmanagement.controllers;

import com.egerton.projectmanagement.models.Milestone;
import com.egerton.projectmanagement.models.Status;
import com.egerton.projectmanagement.models.Task;
import com.egerton.projectmanagement.repositories.MilestoneRepository;
import com.egerton.projectmanagement.repositories.TaskRepository;
import com.egerton.projectmanagement.requests.TaskRequest;
import com.egerton.projectmanagement.utils.ResponseHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/tasks")

public class TaskController {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private MilestoneRepository milestoneRepository;

    // get all tasks
    @GetMapping()
    public ResponseEntity<Object> getAllTasks(){
        try{
            //empty array list of tasks
            List<Task> tasks = new ArrayList<>();
            //get tasks and populate the array list
            taskRepository.findAll().forEach( tasks::add);
            if(tasks.isEmpty()){ // no tasks found
                return  ResponseHandler.generateResponse(
                        "No task record was found",
                        HttpStatus.NOT_FOUND,
                        null
                );
            }
            return ResponseHandler.generateResponse(
                    null,
                    HttpStatus.OK,
                    tasks
            );
        }catch (Exception e){
            e.printStackTrace();
            return ResponseHandler.generateResponse(
                    e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    null
            );
        }
    }

    //get single task
    @GetMapping("/{id}")
    public ResponseEntity<Object> getTask(@PathVariable("id") long id){
        try{
            //find task by id
            Optional<Task> optionalTask = taskRepository.findById(id);
            //task found
            return optionalTask.map(task -> ResponseHandler.generateResponse(
                    null,
                    HttpStatus.OK,
                    task
            )).orElseGet(() -> ResponseHandler.generateResponse(
                    "Task with id " + id + " not found",
                    HttpStatus.NOT_FOUND,
                    null
            ));
            // task not found
        }catch (Exception e){
            e.printStackTrace();
            return ResponseHandler.generateResponse(
                    e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    null
            );
        }
    }

    //create task
    @PostMapping()
    public ResponseEntity<Object> createTask(@Valid @RequestBody TaskRequest requestData){
        try{
            //find milestone
            Optional<Milestone> optionalMilestone = milestoneRepository.findById(requestData.getMilestoneId());

            if(optionalMilestone.isPresent()){
                Milestone milestone = optionalMilestone.get();
                //create task object
                Task task = new Task();
                //populate task object with data
                populateTask(task, requestData);
                task.setMilestone( milestone);
                task.setStatus(Status.PENDING);
                task.setCreatedAt( new Date());
                task.setUpdateAt( new Date());

                //save task
                Task _task = taskRepository.save(task);

                return ResponseHandler.generateResponse(
                        "Task created successfully.",
                        HttpStatus.OK,
                        _task
                );
            }

            return ResponseHandler.generateResponse(
                    "Error. Could not create task. Milestone not found",
                    HttpStatus.NOT_FOUND,
                    null
            );

        } catch (Exception e){
            e.printStackTrace();
            return ResponseHandler.generateResponse(
                    e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    null
            );
        }
    }

    //update task
    @PutMapping("/{id}")
    public ResponseEntity<Object> updateTask(@PathVariable("id") long id, @Valid @RequestBody TaskRequest requestData){
        try{
            //find task by id
            Optional<Task> optionalTask = taskRepository.findById(id);
            if(optionalTask.isPresent()) { //task found

                Task task = optionalTask.get();
                populateTask(task, requestData);
                task.setUpdateAt(new Date());

                //save task
                Task _task = taskRepository.save(task);

                return ResponseHandler.generateResponse(
                        "Task details updated successful.",
                        HttpStatus.OK,
                        _task
                );
            }
            // task not found
            return ResponseHandler.generateResponse(
                    "Task with id " + id + " not found",
                    HttpStatus.NOT_FOUND,
                    null
            );
        } catch (Exception e){
            e.printStackTrace();
            return ResponseHandler.generateResponse(
                    e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    null
            );
        }
    }

    protected void populateTask( Task task, TaskRequest requestData){
        task.setName( requestData.getName());
        task.setDescription( requestData.getDescription());
        task.setStartDate( requestData.getStartDate());
        task.setEndDate( requestData.getEndDate());
    }

    // get all task by status
    @GetMapping("/status/{status}")
    public ResponseEntity<Object> getAllTasksByStatus(@PathVariable("status") String status){
        try{
            //empty array list of tasks
            List<Task> tasks = new ArrayList<>();
            //get tasks and populate the array list
            taskRepository.findAllByStatus( Status.valueOf(status)).forEach( tasks::add);
            if(tasks.isEmpty()){ // no projects found
                return  ResponseHandler.generateResponse(
                        "No task record was found",
                        HttpStatus.NOT_FOUND,
                        null
                );
            }
            return ResponseHandler.generateResponse(
                    null,
                    HttpStatus.OK,
                    tasks
            );
        }catch (Exception e){
            e.printStackTrace();
            return ResponseHandler.generateResponse(
                    e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    null
            );
        }
    }

    // change status
    @PutMapping("/{id}/status/{status}")
    public ResponseEntity<Object> setStatus(@PathVariable("id") long id, @PathVariable("status") String status){
        try{

            //find task by id
            Optional<Task> optionalTask = taskRepository.findById(id);
            if(optionalTask.isPresent()) { //task found

                Task task = optionalTask.get();
                task.setStatus( Status.valueOf(status));
                task.setUpdateAt(new Date());

                //save task
                Task _task = taskRepository.save(task);

                return ResponseHandler.generateResponse(
                        "Task status changed successful.",
                        HttpStatus.OK,
                        _task
                );
            }
            // task not found
            return ResponseHandler.generateResponse(
                    "Task with id " + id + " not found",
                    HttpStatus.NOT_FOUND,
                    null
            );
        }catch (Exception e){
            e.printStackTrace();
            return ResponseHandler.generateResponse(
                    e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    null
            );
        }
    }

    //delete task
    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deleteTask(@PathVariable("id") long id){
        try{
            //find task
            Optional<Task> optionalTask = taskRepository.findById(id);
            if(optionalTask.isPresent()){//task found
                taskRepository.delete(optionalTask.get());
                return  ResponseHandler.generateResponse(
                        null,
                        HttpStatus.NO_CONTENT,
                        null
                );
            }
            //task not found
            return ResponseHandler.generateResponse(
                    "Task with id " + id + " not found",
                    HttpStatus.NOT_FOUND,
                    null
            );
        }catch (Exception e){
            e.printStackTrace();
            return ResponseHandler.generateResponse(
                    e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    null
            );
        }
    }

    //delete all tasks
    @DeleteMapping()
    public ResponseEntity<Object> deleteAllTasks(){
        try{
            taskRepository.deleteAll();
            return  ResponseHandler.generateResponse(
                    null,
                    HttpStatus.NO_CONTENT,
                    null
            );
        }catch (Exception e){
            e.printStackTrace();
            return ResponseHandler.generateResponse(
                    e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    null
            );
        }
    }

}
