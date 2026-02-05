package com.example.rollbasedlogin.model;


import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String employeeName;
    private String pickup;
    private String dropLocation;
    private String pickupTime;
    private String cabType;

    private String bookingDate;  // formatted string: yyyy-MM-dd
    private String status;       // BOOKED / COMPLETED / CANCELLED
    private String hrEmail;
    private String driverEmail; // Assigned driver (nullable)


private boolean completed = false;
    private int durationMin = 2;

@Column(name = "created_at")
private LocalDateTime createdAt = LocalDateTime.now();
    // --- Getters & Setters ---

    public Long getId() {
        return this.id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmployeeName() {
        return this.employeeName;
    }

    public void setEmployeeName(String employeeName) {
        this.employeeName = employeeName;
    }

    public String getPickup() {
        return this.pickup;
    }

    public void setPickup(String pickup) {
        this.pickup = pickup;
    }

    public String getDropLocation() {
        return this.dropLocation;
    }

    public void setDropLocation(String dropLocation) {
        this.dropLocation = dropLocation;
    }

    public String getPickupTime() {
        return this.pickupTime;
    }

    public void setPickupTime(String pickupTime) {
        this.pickupTime = pickupTime;
    }

    public String getCabType() {
        return this.cabType;
    }

    public void setCabType(String cabType) {
        this.cabType = cabType;
    }

    public String getBookingDate() {
        return this.bookingDate;
    }

    public void setBookingDate(String bookingDate) {
        this.bookingDate = bookingDate;
    }

    public String getStatus() {
        return this.status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getHrEmail() {
        return this.hrEmail;
    }

    public void setHrEmail(String hrEmail) {
        this.hrEmail = hrEmail;
    }

    public String getDriverEmail() {
        return this.driverEmail;
    }

    public void setDriverEmail(String driverEmail) {
        this.driverEmail = driverEmail;
    }



    public boolean isCompleted() {
    return this.completed;
}

public void setCompleted(boolean completed) {
    this.completed = completed;
}

public int getDurationMin() {
    return this.durationMin;
}

public void setDurationMin(int durationMin) {
    this.durationMin = durationMin;
}

public LocalDateTime getCreatedAt() {
    return this.createdAt;
}

public void setCreatedAt(LocalDateTime createdAt) {
    this.createdAt = createdAt;
}

}
