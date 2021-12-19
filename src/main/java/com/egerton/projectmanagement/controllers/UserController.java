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
        }catch(Exception exception){
        return ResponseHandler.generateResponse(exception);
        }
    }
    // get user by email
    @GetMapping("/{email}")
    public ResponseEntity<Object> getUserByEmail(@PathVariable String email){
        try{
            Optional<UserModel> user  = userRepository.findUserByEmail(email);
            if(user.isPresent()){ // found
                return ResponseHandler.generateResponse(
                        null,
                        HttpStatus.OK,
                        user.get()
                );
            }
            return  ResponseHandler.generateResponse(
                    "No user record was found with email: " + email,
                    HttpStatus.NOT_FOUND,
                    null
            );
        }catch(Exception exception){
        return ResponseHandler.generateResponse(exception);
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
        }catch(Exception exception){
        return ResponseHandler.generateResponse(exception);
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
        }catch(Exception exception){
        return ResponseHandler.generateResponse(exception);
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
        }catch(Exception exception){
        return ResponseHandler.generateResponse(exception);
        }
    }
}
