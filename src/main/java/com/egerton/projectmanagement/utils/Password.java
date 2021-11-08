package com.egerton.projectmanagement.utils;

import org.mindrot.jbcrypt.BCrypt;

public class Password {
    // encrypts a plain text password
    public static String hashpwd( String plainText){
        return BCrypt.hashpw( plainText, BCrypt.gensalt());
    }
    // compare plain text to hashed password
    public static boolean checkpw( String plainText, String hashedPassword){
        if( BCrypt.checkpw(plainText, hashedPassword))
            return true;
        return false;
    }
}
