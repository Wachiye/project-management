package com.egerton.projectmanagement.controllers;

import com.egerton.projectmanagement.models.*;
import com.egerton.projectmanagement.repositories.ProjectRepository;
import com.egerton.projectmanagement.repositories.StudentRepository;
import com.egerton.projectmanagement.repositories.UserRepository;
import com.egerton.projectmanagement.requests.StudentRequest;
import com.egerton.projectmanagement.requests.StudentUpdate;
import com.egerton.projectmanagement.services.EmailService;
import com.egerton.projectmanagement.utils.Password;
import com.egerton.projectmanagement.utils.ResponseHandler;
import net.bytebuddy.utility.RandomString;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/v1/students")

public class StudentController {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private EmailService emailService;

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
        }catch(Exception exception){
        return ResponseHandler.generateResponse(exception);
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
        }catch(Exception exception){
        return ResponseHandler.generateResponse(exception);
        }
    }

    //register student
    @PostMapping("/register")
    public ResponseEntity<Object> createStudent(@Validated @RequestBody StudentRequest requestData){
        try{
            //check email
            if( userEmailExists( requestData.getEmail())){
                return ResponseHandler.generateResponse(
                        "Student Registration Failed. Email already exists.",
                        HttpStatus.BAD_REQUEST,
                        null
                );
            }

            //check std reg no id
            if( studentRegNoExists( requestData.getRegNo())){
                return ResponseHandler.generateResponse(
                        "Student Registration Failed. Registration No already exists.",
                        HttpStatus.BAD_REQUEST,
                        null
                );
            }

            UserModel user = new UserModel();
            populateUser( user, requestData);

            //generate verification code
            String randomCode = RandomString.make(64);
            user.setActive(false);
            user.setVerificationCode(randomCode);
            user.setCreatedAt( new Date());

            //save user
            UserModel _user = userRepository.save( user);

            emailService.sendVerificationCode( user, requestData.getVerificationURL());
            Student student = new Student();
            student.setUser( _user);
            student.setRegNo( requestData.getRegNo());

            //save std
            Student _student = studentRepository.save(student);

            return ResponseHandler.generateResponse(
                    "Student registration was successful. Please check email for account verification link",
                    HttpStatus.OK,
                    _student
            );
        } catch(Exception exception){
        return ResponseHandler.generateResponse(exception);
        }
    }

    private void populateUser(UserModel user, StudentRequest requestData) {
        user.setFirstName( requestData.getFirstName());
        user.setLastName(requestData.getLastName());
        user.setEmail(requestData.getEmail());
        user.setPassword(Password.hashpwd( requestData.getPassword()));
        user.setRole( UserRoles.valueOf( requestData.getRole()));
        user.setUpdateAt( new Date());
    }

    //update student
    @PutMapping(value = "/{id}")
    public ResponseEntity<Object> updateStudent(@PathVariable("id") long id, @Validated @RequestBody StudentUpdate requestData){
        try{
            //find student by id
            Optional<Student> optionalStudent = studentRepository.findById(id);

            if(optionalStudent.isPresent()) { //student account found

                Student student = optionalStudent.get();
                UserModel user = student.getUser();

                //update user details
                user.setFirstName(requestData.getFirstName());
                user.setLastName(requestData.getLastName());
                user.setEmail(requestData.getEmail());
                user.setUpdateAt( new Date());
                userRepository.save(user);

                //save student
                student.setRegNo(requestData.getRegNo());
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
        } catch(Exception exception){
        return ResponseHandler.generateResponse(exception);
        }
    }


    //delete student
    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deleteStudent(@PathVariable("id") long id){
        try{
            //find student
            Optional<Student> optionalStudent = studentRepository.findById(id);
            if(optionalStudent.isPresent()){//student found
                studentRepository.deleteById(id);
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
        }catch(Exception exception){
        return ResponseHandler.generateResponse(exception);
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
        }catch(Exception exception){
        return ResponseHandler.generateResponse(exception);
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
        }catch(Exception exception){
        return ResponseHandler.generateResponse(exception);
        }
    }

    protected boolean userEmailExists( String email){
        Optional<UserModel> userOptional = userRepository.findUserByEmail( email);
        if ( userOptional.isPresent()){
            return  true;
        }
        return false;
    }

    protected  boolean studentRegNoExists( String regNo){
        Optional<Student> studentOptional = studentRepository.findStudentByRegNo( regNo);
        if ( studentOptional.isPresent()){
            return  true;
        }
        return false;
    }
}
