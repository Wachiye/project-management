package com.egerton.projectmanagement.controllers;

import com.egerton.projectmanagement.models.Project;
import com.egerton.projectmanagement.models.ProjectFile;
import com.egerton.projectmanagement.models.Student;
import com.egerton.projectmanagement.repositories.ProjectFileRepository;
import com.egerton.projectmanagement.repositories.ProjectRepository;
import com.egerton.projectmanagement.repositories.StudentRepository;
import com.egerton.projectmanagement.requests.StudentRequest;
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
@RequestMapping("/api/v1/students")
public class StudentController {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private ProjectFileRepository fileRepository;

    // get all students
    @GetMapping()
    public ResponseEntity<Object> getAllStudents(){
        try{
            //empty array list of students
            List<Student> students = new ArrayList<>();
            //get students and populate the array list
            studentRepository.findAll().forEach( students::add);
            if(students.isEmpty()){ // no students found
                return  ResponseHandler.generateResponse(
                        "No student record was found",
                        HttpStatus.NOT_FOUND,
                        null
                );
            }
            return ResponseHandler.generateResponse(
                    null,
                    HttpStatus.OK,
                    students
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

    //get single student
    @GetMapping("/{id}")
    public ResponseEntity<Object> getStudent(@PathVariable("id") long id){
        try{
            //find student by id
            Optional<Student> optionalStudent = studentRepository.findById(id);
            //student found
            return optionalStudent.map(student -> ResponseHandler.generateResponse(
                    null,
                    HttpStatus.OK,
                    student
            )).orElseGet(() -> ResponseHandler.generateResponse(
                    "Student with id " + id + " not found",
                    HttpStatus.NOT_FOUND,
                    null
            ));
            //student not found
        }catch (Exception e){
            e.printStackTrace();
            return ResponseHandler.generateResponse(
                    e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    null
            );
        }
    }

    //create student
    @PostMapping()
    public ResponseEntity<Object> createStudent(@Valid @RequestBody StudentRequest requestData){
        try{
            //get data
            Student student = new Student();
            populateStudent(student, requestData);
            student.setCreatedAt( new Date());
            student.setUpdateAt( new Date());

            //save student
            Student _student = studentRepository.save(student);

            return ResponseHandler.generateResponse(
                    "Student registration was successful.",
                    HttpStatus.OK,
                    _student
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

    //update student
    @PutMapping("/{id}")
    public ResponseEntity<Object> updateStudent(@PathVariable("id") long id, @Valid @RequestBody StudentRequest requestData){
        try{
            //find student by id
            Optional<Student> optionalStudent = studentRepository.findById(id);
            if(optionalStudent.isPresent()) { //student found

                Student student = optionalStudent.get();
                populateStudent(student, requestData);
                student.setUpdateAt(new Date());

                //save student
                Student _student = studentRepository.save(student);

                return ResponseHandler.generateResponse(
                        "Student details updated successful.",
                        HttpStatus.OK,
                        _student
                );
            }
            //student not found
            return ResponseHandler.generateResponse(
                    "Student with id " + id + " not found",
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

    protected void populateStudent( Student student, StudentRequest requestData){
        student.setFirstName( requestData.getFirstName());
        student.setLastName(requestData.getLastName());
        student.setEmail(requestData.getEmail());
        student.setRegNo(requestData.getRegNo());
        student.setPassword(requestData.getPassword()); //must be hashed
    }

    //delete student
    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deleteStudent(@PathVariable("id") long id){
        try{
            //find student
            Optional<Student> optionalStudent = studentRepository.findById(id);
            if(optionalStudent.isPresent()){//student found
                studentRepository.delete(optionalStudent.get());
                return  ResponseHandler.generateResponse(
                        null,
                        HttpStatus.NO_CONTENT,
                        null
                );
            }
            return ResponseHandler.generateResponse(
                    "Student with id " + id + " not found",
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

    //delete all students
    @DeleteMapping()
    public ResponseEntity<Object> deleteAllStudents(){
        try{
            studentRepository.deleteAll();
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

    //get student projects
    @GetMapping("/{id}/projects")
    public  ResponseEntity<Object> getProjects(@PathVariable("id") long id){
        try{
            //find student
            Optional<Student> optionalStudent = studentRepository.findById(id);
            if(optionalStudent.isPresent()){//student found
                //get projects
                //empty array list of projects
                List<Project> projects = new ArrayList<>();
                //get projects and populate the array list
                projectRepository.findAllByStudent( optionalStudent.get()).forEach( projects::add);
                if(projects.isEmpty()){ // no projects found
                    return  ResponseHandler.generateResponse(
                            "No project record was found with student id " + id,
                            HttpStatus.NOT_FOUND,
                            null
                    );
                }
                return ResponseHandler.generateResponse(
                        null,
                        HttpStatus.OK,
                        projects
                );

            }

            //student not found
            return ResponseHandler.generateResponse(
                    "Student with id " + id + " not found",
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

    //get files
    @GetMapping("/{id}/files")
    public  ResponseEntity<Object> getFiles(@PathVariable("id") long id){
        try{
            //find student
            Optional<Student> optionalStudent = studentRepository.findById(id);
            if(optionalStudent.isPresent()){//student found
                //empty array list of files
                List<ProjectFile> files = new ArrayList<>();
                //get files and populate the array list
                fileRepository.findAllByStudent(optionalStudent.get()).forEach(files::add);

                if(files.isEmpty()){ // no tasks found
                    return  ResponseHandler.generateResponse(
                            "No file record was found with project id " + id,
                            HttpStatus.NOT_FOUND,
                            null
                    );
                }

                return ResponseHandler.generateResponse(
                        null,
                        HttpStatus.OK,
                        files
                );
            }
            //student not found
            return ResponseHandler.generateResponse(
                    "Student with id " + id + " not found",
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
}
