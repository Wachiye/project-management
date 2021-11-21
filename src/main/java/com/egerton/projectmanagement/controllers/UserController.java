package com.egerton.projectmanagement.controllers;

import com.egerton.projectmanagement.models.Staff;
import com.egerton.projectmanagement.models.Student;
import com.egerton.projectmanagement.models.UserModel;
import com.egerton.projectmanagement.models.UserRoles;
import com.egerton.projectmanagement.repositories.UserRepository;
import com.egerton.projectmanagement.utils.ResponseHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/users")

public class UserController {

    @Autowired
    private UserRepository userRepository;

    // get all users
    @GetMapping()
    public ResponseEntity<Object> getAllUsers(){
        try{
            //empty array list of users
            List<UserModel> users = new ArrayList<>();
            //get users and populate the array list
            userRepository.findAll().forEach( users::add);
            if(users.isEmpty()){ // no users found
                return  ResponseHandler.generateResponse(
                        "No user record was found",
                        HttpStatus.NOT_FOUND,
                        null
                );
            }
            return ResponseHandler.generateResponse(
                    null,
                    HttpStatus.OK,
                    users
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

    // get all staffs
    @GetMapping("/role/{role}")
    public ResponseEntity<Object> getAllUsersByRole(@PathVariable("role") String role){
        try{
            //empty array list of users
            List<UserModel> users = new ArrayList<>();
            //get users and populate the array list
            userRepository.findAllByRole( UserRoles.valueOf( role)).forEach( users::add);
            if(users.isEmpty()){ // no users found
                return  ResponseHandler.generateResponse(
                        "No User record was found",
                        HttpStatus.NOT_FOUND,
                        null
                );
            }
            return ResponseHandler.generateResponse(
                    null,
                    HttpStatus.OK,
                    users
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
    //delete user
    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deleteStudent(@PathVariable("id") long id){
        try{
            //find user
            Optional<UserModel> optionalUser = userRepository.findById(id);
            if(optionalUser.isPresent()){//user found
                userRepository.delete(optionalUser.get());
                return  ResponseHandler.generateResponse(
                        null,
                        HttpStatus.NO_CONTENT,
                        null
                );
            }
            return ResponseHandler.generateResponse(
                    "User with id " + id + " not found",
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

    //delete all users
    @DeleteMapping()
    public ResponseEntity<Object> deleteAllStudents(){
        try{
            userRepository.deleteAll();
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
