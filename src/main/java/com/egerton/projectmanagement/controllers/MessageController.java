package com.egerton.projectmanagement.controllers;

import com.egerton.projectmanagement.models.Email;
import com.egerton.projectmanagement.models.Message;
import com.egerton.projectmanagement.models.MessageReply;
import com.egerton.projectmanagement.models.UserModel;
import com.egerton.projectmanagement.repositories.MessageRepository;
import com.egerton.projectmanagement.repositories.ReplyRepository;
import com.egerton.projectmanagement.repositories.UserRepository;
import com.egerton.projectmanagement.requests.MessageRequest;
import com.egerton.projectmanagement.requests.ReplyRequest;
import com.egerton.projectmanagement.services.EmailService;
import com.egerton.projectmanagement.utils.ResponseHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/messages")
public class MessageController {
    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private ReplyRepository replyRepository;

    @Autowired
    private UserRepository userRepository;

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
            message.setCreatedAt( new Date());

            if(requestData.getReceiverName() != null){
                message.setReceiverName( requestData.getReceiverName());
            }

            if(requestData.getReceiverEmail() != null){
                message.setReceiverEmail( requestData.getReceiverEmail());
            }
            //save message
            Message _message = messageRepository.save( message);
            
            sendEmailToReceiver( _message);

            if(message.getReceiverEmail() == null)
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

    @PostMapping("/{id}/reply/")
    public ResponseEntity<Object> reply(@PathVariable("id") long id, @Validated ReplyRequest requestData){
        try{
            Optional<Message> optionalMessage = messageRepository.findById(id);
            Optional<UserModel> optionalUser = userRepository.findById(requestData.getUserId());

            if(optionalMessage.isPresent() && optionalUser.isPresent()) {
                MessageReply reply = new MessageReply();
                reply.setReply(requestData.getReply());
                reply.set_message( optionalMessage.get());
                reply.setRepliedBy( optionalUser.get());
                reply.setCreatedAt( new Date());

                //save reply
                MessageReply _reply = replyRepository.save( reply);

                //notify previous sender
                Message message = new Message();
                message.setMessage( reply.getReply());
                message.setSenderName( optionalUser.get().getFullName());
                message.setSenderEmail( optionalUser.get().getEmail());
                message.setReceiverEmail( optionalMessage.get().getReceiverEmail() );

                sendEmailToReceiver(message);

                return ResponseHandler.generateResponse(
                        "Reply send successfully. Thank you",
                        HttpStatus.OK,
                        _reply
                );
            }
            return ResponseHandler.generateResponse(
                    "Unable to send reply. Invalid user or replying to unknown message",
                    HttpStatus.OK,
                    null
            );
        }catch (Exception exception){
            return ResponseHandler.generateResponse(exception);
        }
    }

    //delete message
    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deleteMessage(@PathVariable("id") long id){
        //find message
        Optional<Message> optionalMessage = messageRepository.findById(id);
        if(optionalMessage.isPresent()){//message found
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
        email.setSubject("Your message has been received");

        String text = "<p>Hi " + message.getSenderEmail() + "<p/>," +
                "<p>This is to confirm that your request has been received.</p>" +
                "<p>You will be notified once your request has been acted upon</p>"+
                "<p>If you didn't send any request, you can safely ignore this email. Someone might have typed your email address by mistake</p>"+
                "<p><strong>Thanks</strong>,<br/>" +
                "<strong>APAMS EGERTON ADMINISTRATOR</p>";
        email.setText(text);

        emailService.sendHtml( email);
    }

    public void sendEmailToReceiver(Message message){
        //email
        Email email = new Email();
        email.setFrom( SYSTEM_EMAIL );
        email.setSenderName("APAMS EGERTON");

        if(message.getReceiverEmail() != null){
            email.setTo( message.getReceiverEmail());
            String text = "<p>Hi " + message.getReceiverEmail() + "<p/>," +
                    "<p>" + message.getReceiverName() + "<" + message.getSenderEmail() + "> has send you the following message" +
                    "<div>" + message.getMessage() + ".</div>";
            email.setText(text);
        }else{
            email.setTo( SYSTEM_EMAIL);
            email.setText(message.getMessage());
        }

        email.setSubject(message.getSenderName() + " send you a message");

        emailService.sendHtml( email);
    }

}
