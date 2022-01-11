package com.egerton.projectmanagement.controllers;

import com.egerton.projectmanagement.models.*;
import com.egerton.projectmanagement.repositories.NotificationRepository;
import com.egerton.projectmanagement.repositories.StaffRepository;
import com.egerton.projectmanagement.repositories.UserRepository;
import com.egerton.projectmanagement.requests.CommentRequest;
import com.egerton.projectmanagement.requests.NotificationRequest;
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
@RequestMapping("/api/v1/notifications")

public class NotificationController {
    
    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private StaffRepository staffRepository;

    @Autowired
    private UserRepository userRepository;

    @Value(value="spring.mail.username")
    private String SYSTEM_EMAIL;

    @Autowired
    private EmailService emailService;

    // get all notifications
    @GetMapping()
    public ResponseEntity<Object> getAllNotifications(){
        try{
            //empty array list of notifications
            List<Notification> notifications = new ArrayList<>();
            //get notifications and populate the array list
            notificationRepository.findAll().forEach( notifications::add);
            if(notifications.isEmpty()){ // no notifications found
                return  ResponseHandler.generateResponse(
                        "No notification record was found",
                        HttpStatus.NOT_FOUND,
                        null
                );
            }
            return ResponseHandler.generateResponse(
                    null,
                    HttpStatus.OK,
                    notifications
            );
        }catch(Exception exception){
        return ResponseHandler.generateResponse(exception);
        }
    }

    //get single notification
    @GetMapping("/{id}")
    public ResponseEntity<Object> getNotification(@PathVariable("id") long id){
        try{
            //find notification by id
            Optional<Notification> optionalNotification = notificationRepository.findById(id);
            //notification found
            return optionalNotification.map(notification -> ResponseHandler.generateResponse(
                    null,
                    HttpStatus.OK,
                    notification
            )).orElseGet(() -> ResponseHandler.generateResponse(
                    "Notification with id " + id + " not found",
                    HttpStatus.NOT_FOUND,
                    null
            ));
            //notification not found
        }catch(Exception exception){
        return ResponseHandler.generateResponse(exception);
        }
    }

    //create notification
    @PostMapping()
    public ResponseEntity<Object> createNotification(@Validated @RequestBody NotificationRequest requestData){
        try{
            //find user
            Optional<UserModel> optionalUser = userRepository.findById(requestData.getUserId());

            if(optionalUser.isPresent()) {
                //get data
                Notification notification = new Notification();
                NotificationTypes notificationType = NotificationTypes.valueOf( requestData.getType());

                populateNotification(notification, requestData);
                notification.setPostedBy( optionalUser.get());
                notification.setCreatedAt(new Date());
                notification.setUpdateAt(new Date());

                //save notification
                Notification _notification = notificationRepository.save(notification);

                //send emails
                this.notifyUsers(notification);

                //return
                return ResponseHandler.generateResponse(
                        "Notification was send successful.",
                        HttpStatus.OK,
                        _notification
                );
            }
            return ResponseHandler.generateResponse(
                    "Error. Could not post notification.Staff not found",
                    HttpStatus.OK,
                    null
            );

        } catch(Exception exception){
        return ResponseHandler.generateResponse(exception);
        }
    }

    //update notification
    @PutMapping("/{id}")
    public ResponseEntity<Object> updateNotification(@PathVariable("id") long id, @Validated @RequestBody NotificationRequest requestData){
        try{
            //find notification by id
            Optional<Notification> optionalNotification = notificationRepository.findById(id);
            if(optionalNotification.isPresent()) { //notification found

                Notification notification = optionalNotification.get();
                populateNotification(notification, requestData);
                notification.setUpdateAt(new Date());

                //save notification
                Notification _notification = notificationRepository.save(notification);

                return ResponseHandler.generateResponse(
                        "Notification details updated successful.",
                        HttpStatus.OK,
                        _notification
                );
            }
            //notification not found
            return ResponseHandler.generateResponse(
                    "Notification with id " + id + " not found",
                    HttpStatus.NOT_FOUND,
                    null
            );
        } catch(Exception exception){
        return ResponseHandler.generateResponse(exception);
        }
    }

    protected void populateNotification( Notification notification, NotificationRequest requestData){
        notification.setMessage( requestData.getMessage());
        notification.setTitle(requestData.getTitle());
        notification.setType(NotificationTypes.valueOf( requestData.getType()));
    }

    // get all notifications by type
    @GetMapping("/type/{type}")
    public ResponseEntity<Object> getAllNotificationsByType(@PathVariable("type") String type){
        try{
            //empty array list of notifications
            List<Notification> notifications = new ArrayList<>();
            //get notifications and populate the array list
            notificationRepository.findAllByType( NotificationTypes.valueOf(type)).forEach( notifications::add);
            if(notifications.isEmpty()){ // no notifications found
                return  ResponseHandler.generateResponse(
                        "No Notification record was found",
                        HttpStatus.NOT_FOUND,
                        null
                );
            }
            return ResponseHandler.generateResponse(
                    null,
                    HttpStatus.OK,
                    notifications
            );
        }catch(Exception exception){
        return ResponseHandler.generateResponse(exception);
        }
    }

    //delete notification
    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deleteNotification(@PathVariable("id") long id){
        try{
            //find notification
            Optional<Notification> optionalNotification = notificationRepository.findById(id);
            if(optionalNotification.isPresent()){//notification found
                notificationRepository.deleteById(id);
                return  ResponseHandler.generateResponse(
                        null,
                        HttpStatus.NO_CONTENT,
                        null
                );
            }
            return ResponseHandler.generateResponse(
                    "Notification with id " + id + " not found",
                    HttpStatus.NOT_FOUND,
                    null
            );
        }catch(Exception exception){
        return ResponseHandler.generateResponse(exception);
        }
    }

    //delete all notifications
    @DeleteMapping()
    public ResponseEntity<Object> deleteAllNotifications(){
        try{
            notificationRepository.deleteAll();
            return  ResponseHandler.generateResponse(
                    null,
                    HttpStatus.NO_CONTENT,
                    null
            );
        }catch(Exception exception){
            return ResponseHandler.generateResponse(exception);
        }
    }

    protected void notifyUsers(Notification notification){
        //get users based on notification type
        NotificationTypes notificationType = notification.getType();
        List<UserModel> users = new ArrayList<>();

        if( notificationType.compareTo( NotificationTypes.SYSTEM) == 0){
            users = userRepository.findAll();
        } else {
            users = userRepository.findAllByRole( UserRoles.valueOf( notificationType.toString()));
        }

        //get emails
        StringBuilder toEmails = new StringBuilder();

        for (int i = 0; i < users.size(); i++) {
            if( i == users.size() - 1)
                toEmails.append(users.get(i).getEmail());
            else
                toEmails.append(users.get(i).getEmail()).append(",");
        }

        //compose email
        Email email = new Email();
        email.setFrom( this.SYSTEM_EMAIL);
        email.setSenderName("Academic Project Approval And Management System");
        email.setTo(null);
        email.setToMany( toEmails.toString().split(","));
        email.setSubject("APAMS: " + notification.getTitle());
        email.setText( notification.getMessage());
        email.setAttachments(null);

        //send email
        emailService.sendHtml( email);
    }
}
