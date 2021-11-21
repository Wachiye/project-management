package com.egerton.projectmanagement.services;

import com.egerton.projectmanagement.models.Email;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import java.io.File;

@Service
public class EmailService {
    @Autowired
    private JavaMailSender mailSender;

    public boolean sendPlainText( Email email){
        try {
            SimpleMailMessage message = new SimpleMailMessage();

            message.setFrom(email.getFrom());
            message.setReplyTo( email.getFrom());
            message.setTo( email.getTo());
            message.setSubject(email.getSubject());
            message.setText( email.getText());

            mailSender.send(message);
            return  true;
        } catch (Exception ex){
            ex.printStackTrace();
            return false;
        }
    }

    public boolean sendHtml(Email email){
        try{
            MimeMessage message = mailSender.createMimeMessage();

            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setFrom(email.getFrom(), email.getSenderName());
            helper.setTo(email.getTo());
            helper.setSubject(email.getSubject());
            helper.setText(email.getText());

            //add attachments
            if( email.getAttachments() !=null)
                addAttachments( helper, email);

            mailSender.send( message);
            return true;
        } catch (Exception ex){
            ex.printStackTrace();
            return false;
        }
    }

    protected void addAttachments( MimeMessageHelper helper, Email email){
        email.getAttachments().forEach( attachment -> {
            FileSystemResource file = new FileSystemResource(new File(String.valueOf(attachment)));
            try {
                helper.addAttachment(file.getFilename(), file);
            } catch (MessagingException e) {
                e.printStackTrace();
            }
        });
    }
}
