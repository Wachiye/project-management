package com.egerton.projectmanagement.controllers;

import com.egerton.projectmanagement.models.*;
import com.egerton.projectmanagement.repositories.ProjectFileRepository;
import com.egerton.projectmanagement.repositories.ProjectRepository;
import com.egerton.projectmanagement.repositories.StudentRepository;
import com.egerton.projectmanagement.requests.ProjectFileRequest;
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
@RequestMapping("/api/v1/files")

public class ProjectFileController {
    
    @Autowired
    private ProjectFileRepository fileRepository;
    
    @Autowired
    private ProjectRepository projectRepository;
    
    @Autowired
    private StudentRepository studentRepository;

    // get all project files
    @GetMapping()
    public ResponseEntity<Object> getAllProjectFiles(){
        try{
            //empty array list of projectFiles
            List<ProjectFile> projectFiles = new ArrayList<>();
            //get projectFiles and populate the array list
            fileRepository.findAll().forEach( projectFiles::add);
            if(projectFiles.isEmpty()){ // no projectFiles found
                return  ResponseHandler.generateResponse(
                        "No project file record was found",
                        HttpStatus.NOT_FOUND,
                        null
                );
            }
            return ResponseHandler.generateResponse(
                    null,
                    HttpStatus.OK,
                    projectFiles
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

    //get single project file
    @GetMapping("/{id}")
    public ResponseEntity<Object> getProjectFile(@PathVariable("id") long id){
        try{
            //find project file by id
            Optional<ProjectFile> optionalProjectFile = fileRepository.findById(id);
            //projectFile found
            return optionalProjectFile.map(projectFile -> ResponseHandler.generateResponse(
                    null,
                    HttpStatus.OK,
                    projectFile
            )).orElseGet(() -> ResponseHandler.generateResponse(
                    "Project file with id " + id + " not found",
                    HttpStatus.NOT_FOUND,
                    null
            ));
            // projectFile not found
        }catch (Exception e){
            e.printStackTrace();
            return ResponseHandler.generateResponse(
                    e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    null
            );
        }
    }

    //create project file
    @PostMapping()
    public ResponseEntity<Object> createProjectFile(@Valid @RequestBody ProjectFileRequest requestData){
        try{
            //find project
            Optional<Project> optionalProject = projectRepository.findById(requestData.getProjectId());
            //find student
            Optional<Student> optionalStudent = studentRepository.findById(requestData.getStudentId());

            if(optionalProject.isPresent() && optionalStudent.isPresent()){ // project and student found
                //create project file object
                ProjectFile projectFile = new ProjectFile();
                //populate project file object with data
                populateProjectFile(projectFile, requestData);
                projectFile.setProject( optionalProject.get());
                projectFile.setStudent( optionalStudent.get());
                projectFile.setStatus(Status.PENDING);
                projectFile.setCreatedAt( new Date());
                projectFile.setUpdateAt( new Date());

                //save projectFile
                ProjectFile _projectFile = fileRepository.save(projectFile);

                return ResponseHandler.generateResponse(
                        "Project file created successfully.",
                        HttpStatus.OK,
                        _projectFile
                );
            }

            return ResponseHandler.generateResponse(
                    "Error. Could not create project file. Student/Project not found.",
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

    //update projectFile
    @PutMapping("/{id}")
    public ResponseEntity<Object> updateProjectFile(@PathVariable("id") long id, @Valid @RequestBody ProjectFileRequest requestData){
        try{
            //find projectFile by id
            Optional<ProjectFile> optionalProjectFile = fileRepository.findById(id);
            if(optionalProjectFile.isPresent()) { //projectFile found

                ProjectFile projectFile = optionalProjectFile.get();
                populateProjectFile(projectFile, requestData);
                projectFile.setUpdateAt(new Date());

                //save projectFile
                ProjectFile _projectFile = fileRepository.save(projectFile);

                return ResponseHandler.generateResponse(
                        "ProjectFile details updated successful.",
                        HttpStatus.OK,
                        _projectFile
                );
            }
            // projectFile not found
            return ResponseHandler.generateResponse(
                    "ProjectFile with id " + id + " not found",
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

    protected void populateProjectFile( ProjectFile projectFile, ProjectFileRequest requestData){
        projectFile.setName( requestData.getName());
        projectFile.setDescription( requestData.getDescription());
        projectFile.setFileURL(requestData.getFileURL());
    }


    // get all projectFile by status
    @GetMapping("/status/{status}")
    public ResponseEntity<Object> getAllProjectFilesByStatus(@PathVariable("status") String status){
        try{
            //empty array list of projectFiles
            List<ProjectFile> projectFiles = new ArrayList<>();
            //get projectFiles and populate the array list
            fileRepository.findAllByStatus( Status.valueOf(status)).forEach( projectFiles::add);
            if(projectFiles.isEmpty()){ // no projects found
                return  ResponseHandler.generateResponse(
                        "No projectFile record was found",
                        HttpStatus.NOT_FOUND,
                        null
                );
            }
            return ResponseHandler.generateResponse(
                    null,
                    HttpStatus.OK,
                    projectFiles
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

            //find projectFile by id
            Optional<ProjectFile> optionalProjectFile = fileRepository.findById(id);
            if(optionalProjectFile.isPresent()) { //projectFile found

                ProjectFile projectFile = optionalProjectFile.get();
                projectFile.setStatus( Status.valueOf(status));
                projectFile.setUpdateAt(new Date());

                //save projectFile
                ProjectFile _projectFile = fileRepository.save(projectFile);

                return ResponseHandler.generateResponse(
                        "ProjectFile status changed successful.",
                        HttpStatus.OK,
                        _projectFile
                );
            }
            // projectFile not found
            return ResponseHandler.generateResponse(
                    "ProjectFile with id " + id + " not found",
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

    //delete project file
    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deleteProjectFile(@PathVariable("id") long id){
        try{
            //find project file
            Optional<ProjectFile> optionalProjectFile = fileRepository.findById(id);
            if(optionalProjectFile.isPresent()){//project file found
                fileRepository.delete(optionalProjectFile.get());
                return  ResponseHandler.generateResponse(
                        null,
                        HttpStatus.NO_CONTENT,
                        null
                );
            }
            //project file not found
            return ResponseHandler.generateResponse(
                    "Project file with id " + id + " not found",
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

    //delete all projectFiles
    @DeleteMapping()
    public ResponseEntity<Object> deleteAllProjectFiles(){
        try{
            fileRepository.deleteAll();
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
