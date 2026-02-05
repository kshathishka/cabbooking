package com.example.rollbasedlogin.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Entity
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Username cannot be empty")
    private String username;

   // @Email(message = "Invalid email format")
   // @NotBlank(message = "Email cannot be empty")
    //@Column(unique = true)
    private String email;

    @NotBlank(message = "Password cannot be empty")
    private String password;

    @NotBlank(message = "Role is required")
    private String role;

    // Getters & Setters
    public Long getId() { return this.id; }

    public String getUsername() { return this.username; }
    public void setUsername(String username) { this.username = username; }

    public String getEmail() { return this.email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return this.password; }
    public void setPassword(String password) { this.password = password; }

    public String getRole() { return this.role; }
    public void setRole(String role) { this.role = role; }
}

















// package com.example.rollbasedlogin.model;



// import jakarta.persistence.Column;
// import jakarta.persistence.Entity;
// import jakarta.persistence.GeneratedValue;
// import jakarta.persistence.GenerationType;
// import jakarta.persistence.Id;

// @Entity
// public class User {

//     @Id
//     @GeneratedValue(strategy = GenerationType.IDENTITY)
//     private Long id;

//     private String username;

//     @Column(unique = true)
//     private String email;

//     private String password;

//     private String role;


//    public String getEmail()
//     {
//         return this.email;
//     }
    
//    public void setPassword(String p)
//     {
//         this.password=p;
//     }
//     public void setUsername(String u)
//     {
//         this.username=u;
//     }

//     public void setEmail(String e)
//     {
//         this.email=e;
//     }
//     public void setRole(String r)
//     {
//         this.role=r;
//     }

//     public String getPassword() {
//        return this.password;
//     }
//     public String getRole() {
//        return this.role;
//     }

    
// }
