package com.example.rollbasedlogin.util;


import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.example.rollbasedlogin.model.Booking;
import com.example.rollbasedlogin.model.Driver;
import com.example.rollbasedlogin.repository.BookingRepository;
import com.example.rollbasedlogin.repository.DriverRepository;

@Component
public class TripCompletionScheduler {

    @Autowired
    private BookingRepository bookingRepo;

    @Autowired
    private DriverRepository driverRepo;

    @Scheduled(fixedRate = 30000) // every half minute
    public void checkTrips() 
    {
        List<Booking> all = this.bookingRepo.findAll();
          System.out.println("checking time");
        for (Booking b : all) 
            {
            if (!b.isCompleted() && b.getDriverEmail() != null) 
                {
                LocalDateTime bookingTime = b.getCreatedAt();
                if (Duration.between(bookingTime, LocalDateTime.now()).toMinutes() >= b.getDurationMin()) {
                    // Mark trip completed
                    b.setCompleted(true);
                    b.setStatus("COMPLETED");
                    this.bookingRepo.save(b);

                    // Make driver available again
                    Driver d = this.driverRepo.findByEmail(b.getDriverEmail());
                    if (d != null) 
                        {
                        d.setAvailable(true);
                        this.driverRepo.save(d);
                    }
                }
            }
        }
    }


    // inside TripCompletionScheduler

@Scheduled(fixedRate = 30000)
public void assignWaitingBookings() {
    List<Booking> waiting = this.bookingRepo.findByStatus("BOOKED");
    System.out.println("checking status");
    for (Booking b : waiting) {
        List<Driver> drivers = this.driverRepo.findByCabTypeAndAvailable(b.getCabType(), true);
        if (!drivers.isEmpty()) {
            Driver d = drivers.get(0);
            b.setDriverEmail(d.getEmail());
            b.setStatus("ASSIGNED");

            d.setAvailable(false);
            this.driverRepo.save(d);
            this.bookingRepo.save(b);
        }
    }
}

}
