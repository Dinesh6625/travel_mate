package com1.Travel_mate.controller;

import org.springframework.web.bind.annotation.*;
import java.util.List;

import com1.Travel_mate.model.Travel_mateModel;
import com1.Travel_mate.service.Travel_mateService;

@RestController
@RequestMapping("/api")
@CrossOrigin("*")
public class Travel_mateController {

    private final Travel_mateService service;

    public Travel_mateController(Travel_mateService service) {
        this.service = service;
    }

    @PostMapping("/register")
    public Travel_mateModel.User register(@RequestBody Travel_mateModel.User user) {
        return service.registerUser(user);
    }

    @PostMapping("/login")
    public Travel_mateModel.User login(@RequestParam String email,
                                       @RequestParam String password) {
        return service.login(email, password);
    }

    @PutMapping("/user/{id}")
    public Travel_mateModel.User updateUser(@PathVariable int id,
                                            @RequestBody Travel_mateModel.User user) {

        Travel_mateModel.User existingUser = service.getUserById(id);

        if (existingUser != null) {
            existingUser.setF_name_u(user.getF_name_u());
            existingUser.setL_name_u(user.getL_name_u());
            existingUser.setEmail(user.getEmail());
            existingUser.setContact_number(user.getContact_number());
            return service.registerUser(existingUser);
        }
        return null;
    }

    @GetMapping("/places")
    public List<Travel_mateModel.Place> getAllPlaces() {
        return service.getAllPlaces();
    }

    @PostMapping("/places")
    public Travel_mateModel.Place addPlace(@RequestBody Travel_mateModel.Place place,
                                           @RequestParam String role) {

        Travel_mateModel.User user = new Travel_mateModel.User();
        user.setRole(role);

        return service.addPlace(place, user);
    }

    @PutMapping("/places/{id}")
    public Travel_mateModel.Place updatePlace(@PathVariable int id,
                                              @RequestBody Travel_mateModel.Place place,
                                              @RequestParam String role) {

        Travel_mateModel.User user = new Travel_mateModel.User();
        user.setRole(role);

        return service.updatePlace(id, place, user);
    }

    @DeleteMapping("/places/{id}")
    public String deletePlace(@PathVariable int id,
                              @RequestParam String role) {

        Travel_mateModel.User user = new Travel_mateModel.User();
        user.setRole(role);

        service.deletePlace(id, user);
        return "Deleted successfully";
    }

    @PostMapping("/book")
    public Travel_mateModel.Booking bookPlace(@RequestBody Travel_mateModel.Booking booking) {
        return service.bookPlace(booking);
    }

    @GetMapping("/bookings")
    public List<Travel_mateModel.Booking> getBookings() {
        return service.getAllBookings();
    }

    @PutMapping("/booking/{id}")
    public Travel_mateModel.Booking updateBooking(@PathVariable int id,
                                                  @RequestBody Travel_mateModel.Booking booking) {
        return service.updateBooking(id, booking);
    }

    @PostMapping("/review")
    public Travel_mateModel.Review addReview(@RequestBody Travel_mateModel.Review review) {
        return service.addReview(review);
    }

    @GetMapping("/reviews")
    public List<Travel_mateModel.Review> getReviews() {
        return service.getAllReviews();
    }
}