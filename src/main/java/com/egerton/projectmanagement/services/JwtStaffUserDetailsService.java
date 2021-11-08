package com.egerton.projectmanagement.services;

import com.egerton.projectmanagement.models.Staff;
import com.egerton.projectmanagement.repositories.StaffRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Optional;

@Service
public class JwtStaffUserDetailsService implements UserDetailsService {
    @Autowired
    private StaffRepository staffRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Optional<Staff> staff = staffRepository.findStaffByEmail(email);
        if(staff.isPresent()){
            return new User( staff.get().getEmail(), staff.get().getPassword(), new ArrayList<>());
        }
        else {
            throw new UsernameNotFoundException("No staff exists with email:" + email);
        }
    }
}
