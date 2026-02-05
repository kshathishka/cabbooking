package com.example.rollbasedlogin.controller;



import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.rollbasedlogin.model.Booking;
import com.example.rollbasedlogin.model.Driver;
import com.example.rollbasedlogin.repository.BookingRepository;
import com.example.rollbasedlogin.repository.DriverRepository;

@RestController
@RequestMapping("/api/hr")
@CrossOrigin(origins = "*")
public class HRController {

  @Autowired
private DriverRepository driverRepo;

@Autowired
private BookingRepository bookingRepo;

@PostMapping("/book")
public String bookCab(@RequestBody Booking booking) 
{
    booking.setBookingDate(LocalDate.now().toString());
    booking.setStatus("BOOKED");

    // 🔍 Try to auto-assign driver
    List<Driver> drivers = this.driverRepo.findByCabTypeAndAvailable(booking.getCabType(), true);
    if (!drivers.isEmpty()) 
    {
        Driver assignedDriver = drivers.get(0); // Pick first available
        booking.setDriverEmail(assignedDriver.getEmail());
        booking.setStatus("ASSIGNED");

        // Mark driver as unavailable
        assignedDriver.setAvailable(false);
        this.driverRepo.save(assignedDriver);
    }

    this.bookingRepo.save(booking);
    return "Booking Successful!";
}

    @GetMapping("/mybookings")
    public List<Booking> getHRBookings(@RequestParam String email) {
        return this.bookingRepo.findByHrEmail(email);
    }




}
