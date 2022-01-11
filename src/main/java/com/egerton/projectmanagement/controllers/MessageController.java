package com.egerton.projectmanagement.controllers;

import com.egerton.projectmanagement.models.Email;
import com.egerton.projectmanagement.models.Message;
import com.egerton.projectmanagement.repositories.MessageRepository;
import com.egerton.projectmanagement.requests.MessageRequest;
import com.egerton.projectmanagement.services.EmailService;
import com.egerton.projectmanagement.utils.ResponseHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/messages")
public class MessageController {
    @Autowired
    private MessageRepository messageRepository;

    @Value(value="spring.mail.username")
    private String SYSTEM_EMAIL;

    @Autowired
    private EmailService emailService;

    //get all messages
    @GetMapping
    public ResponseEntity<Object> getAllMessages(){
        try{
            //empty array list of messages
            List<Message> messages = new ArrayList<>();
            //get messages and populate the array list
            messageRepository.findAll().forEach( messages::add);
            if(messages.isEmpty()){ // no messages found
                return  ResponseHandler.generateResponse(
                        "No message record was found",
                        HttpStatus.NOT_FOUND,
                        null
                );
            }
            return ResponseHandler.generateResponse(
                    null,
                    HttpStatus.OK,
                    messages
            );
        }catch(Exception exception){
            return ResponseHandler.generateResponse(exception);
        }
    }
    
    //get single message
    @GetMapping("/{id}")
    public ResponseEntity<Object> getMessage(@PathVariable("id") long id){
        try{
            //find message by id
            Optional<Message> optionalMessage = messageRepository.findById(id);
            //message found
            return optionalMessage.map(message -> ResponseHandler.generateResponse(
                    null,
                    HttpStatus.OK,
                    message
            )).orElseGet(() -> ResponseHandler.generateResponse(
                    "Message with id " + id + " not found",
                    HttpStatus.NOT_FOUND,
                    null
            ));
            //message not found
        }catch(Exception exception){
            return ResponseHandler.generateResponse(exception);
        }
    }
    
    //save message
    @PostMapping
    public ResponseEntity<Object> createMessage(@Validated @RequestBody MessageRequest requestData){
        try{
            Message message = new Message();
            message.setSenderName(requestData.getSenderName());
            message.setSenderEmail(requestData.getSenderEmail());
            message.setMessage(requestData.getMessage());
            
            //save message
            Message _message = messageRepository.save( message);
            
            sendEmailToReceiver( _message);
            
            sendReceivedConfirmationEmail(_message);

            return ResponseHandler.generateResponse(
                    "Message send successfully. Your will be notified when your message is acted upon. Thank you",
                    HttpStatus.OK,
                    _message
            );
        }catch(Exception exception){
            return ResponseHandler.generateResponse(exception);
        }
    }

    //delete message
    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deleteMessage(@PathVariable("id") long id){
        //find staff
        Optional<Message> optionalMessage = messageRepository.findById(id);
        if(optionalMessage.isPresent()){//staff found
            messageRepository.deleteById(id);
            return  ResponseHandler.generateResponse(
                    null,
                    HttpStatus.NO_CONTENT,
                    null
            );
        }
        return ResponseHandler.generateResponse(
                "Message with id " + id + " not found",
                HttpStatus.NOT_FOUND,
                null
        );
    }

    //delete message
    @DeleteMapping()
    public ResponseEntity<Object> deleteAllMessages(){
        try{
            messageRepository.deleteAll();
            return  ResponseHandler.generateResponse(
                    null,
                    HttpStatus.NO_CONTENT,
                    null
            );
        }catch(Exception exception){
            return ResponseHandler.generateResponse(exception);
        }
    }
    
    public void sendReceivedConfirmationEmail(Message message){
        //email
        Email email = new Email();
        email.setFrom( SYSTEM_EMAIL);
        email.setSenderName("APAMS EGERTON");
        email.setTo( message.getSenderEmail());
        email.setSubject("You have a new message");
        email.setText(message.getMessage());

        emailService.sendHtml( email);
    }

    public void sendEmailToReceiver(Message message){
        //email
        Email email = new Email();
        email.setFrom( message.getSenderEmail());
        email.setSenderName(message.getSenderName());
        email.setTo( SYSTEM_EMAIL);
        email.setSubject("You have a new message");
        email.setText(message.getMessage());

        emailService.sendHtml( email);
    }
}
