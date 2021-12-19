package com.egerton.projectmanagement.controllers;

import com.egerton.projectmanagement.models.*;
import com.egerton.projectmanagement.repositories.*;
import com.egerton.projectmanagement.requests.CommentRequest;
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
@RequestMapping("/api/v1/comments")

public class CommentController {

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private ProjectRepository projectRepository;

    // get all comments
    @GetMapping()
    public ResponseEntity<Object> getAllComments(){
        try{
            //empty array list of comments
            List<Comment> comments = new ArrayList<>();
            //get comments and populate the array list
            commentRepository.findAll().forEach( comments::add);
            if(comments.isEmpty()){ // no comments found
                return  ResponseHandler.generateResponse(
                        "No comment record was found",
                        HttpStatus.NOT_FOUND,
                        null
                );
            }
            return ResponseHandler.generateResponse(
                    null,
                    HttpStatus.OK,
                    comments
            );
        }catch(Exception exception){
        return ResponseHandler.generateResponse(exception);
        }
    }

    //get single comment
    @GetMapping("/{id}")
    public ResponseEntity<Object> getComment(@PathVariable("id") long id){
        try{
            //find comment by id
            Optional<Comment> optionalComment = commentRepository.findById(id);
            //comment found
            return optionalComment.map(comment -> ResponseHandler.generateResponse(
                    null,
                    HttpStatus.OK,
                    comment
            )).orElseGet(() -> ResponseHandler.generateResponse(
                    "Comment with id " + id + " not found",
                    HttpStatus.NOT_FOUND,
                    null
            ));
            //comment not found
        }catch(Exception exception){
        return ResponseHandler.generateResponse(exception);
        }
    }

    //create comment
    @PostMapping()
    public ResponseEntity<Object> createComment(@Valid @RequestBody CommentRequest requestData){
        try{
            //find project
            Optional<Project> optionalProject = projectRepository.findById(requestData.getProjectId());

            //find student
            Optional<UserModel> optionalUser = userRepository.findById(requestData.getUserId());

            if(optionalProject.isPresent() && optionalUser.isPresent()) {
                //get data
                Comment comment = new Comment();
                populateComment(comment, requestData);
                comment.setProject( optionalProject.get());
                comment.setUser( optionalUser.get());
                comment.setCreatedAt(new Date());
                comment.setUpdateAt(new Date());

                //save comment
                Comment _comment = commentRepository.save(comment);

                return ResponseHandler.generateResponse(
                        "Comment was posted successful.",
                        HttpStatus.OK,
                        _comment
                );
            }
            return ResponseHandler.generateResponse(
                    "Error. Could not post comment. User/ Project not found.",
                    HttpStatus.OK,
                    null
            );

        } catch(Exception exception){
        return ResponseHandler.generateResponse(exception);
        }
    }

    //update comment
    @PutMapping("/{id}")
    public ResponseEntity<Object> updateComment(@PathVariable("id") long id, @Valid @RequestBody CommentRequest requestData){
        try{
            //find comment by id
            Optional<Comment> optionalComment = commentRepository.findById(id);
            if(optionalComment.isPresent()) { //comment found

                Comment comment = optionalComment.get();
                populateComment(comment, requestData);
                comment.setUpdateAt(new Date());

                //save comment
                Comment _comment = commentRepository.save(comment);

                return ResponseHandler.generateResponse(
                        "Comment details updated successful.",
                        HttpStatus.OK,
                        _comment
                );
            }
            //comment not found
            return ResponseHandler.generateResponse(
                    "Comment with id " + id + " not found",
                    HttpStatus.NOT_FOUND,
                    null
            );
        } catch(Exception exception){
        return ResponseHandler.generateResponse(exception);
        }
    }

    protected void populateComment( Comment comment, CommentRequest requestData){
        comment.setMessage( requestData.getMessage());
    }

    //delete comment
    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deleteComment(@PathVariable("id") long id){
        try{
            //find comment
            Optional<Comment> optionalComment = commentRepository.findById(id);
            if(optionalComment.isPresent()){//comment found
                commentRepository.delete(optionalComment.get());
                return  ResponseHandler.generateResponse(
                        null,
                        HttpStatus.NO_CONTENT,
                        null
                );
            }
            return ResponseHandler.generateResponse(
                    "Comment with id " + id + " not found",
                    HttpStatus.NOT_FOUND,
                    null
            );
        }catch(Exception exception){
        return ResponseHandler.generateResponse(exception);
        }
    }

    //delete all comments
    @DeleteMapping()
    public ResponseEntity<Object> deleteAllComments(){
        try{
            commentRepository.deleteAll();
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
