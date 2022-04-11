package com.egerton.projectmanagement.bootstrap;

import com.egerton.projectmanagement.models.UserModel;
import com.egerton.projectmanagement.models.UserRoles;
import com.egerton.projectmanagement.repositories.UserRepository;
import com.egerton.projectmanagement.utils.Password;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;


@Service
public class BootstrapDataPopulator implements InitializingBean {
    private final Logger LOG = LoggerFactory.getLogger( BootstrapDataPopulator.class);


    @Autowired
    UserRepository userRepository;

    @Override
    @Transactional
    public void afterPropertiesSet() throws Exception{
        LOG.info("Bootstrapping Data ...");

        createSystemAdministrator();

        LOG.info("... Bootstrapping completed");

    }

    private void  createSystemAdministrator(){
        //check if admins exist
        List<UserModel> users = new ArrayList<>();
        userRepository.findAllByRole( UserRoles.ADMINISTRATOR).forEach( users::add);
        if(users.isEmpty()) {

            LOG.info(" ... Creating System Administrator");
            UserModel admin = new UserModel();
            admin.setFirstName("APAMS");
            admin.setLastName("Administrator");
            admin.setRole(UserRoles.ADMINISTRATOR);
            admin.setEmail("wachiyesiranjofu@gmail.com");
            admin.setActive(true);
            admin.setVerificationCode("1234");
            admin.setPassword(Password.hashpwd("4compsciSTU"));
            admin.setCreatedAt(new Date());
            admin.setUpdateAt(new Date());

            userRepository.save(admin);

            LOG.info("Admin Username: " + admin.getEmail());
            LOG.info("Admin Password: " + "4compsciSTU");
        }else{
            return;
        }
    }
}
