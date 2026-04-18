package com1.Travel_mate.service;

import org.springframework.stereotype.Service;
import java.util.List;

import com1.Travel_mate.model.Travel_mateModel;
import com1.Travel_mate.repository.UserRepository;
import com1.Travel_mate.repository.PlaceRepository;
import com1.Travel_mate.repository.ReviewRepository;
import com1.Travel_mate.repository.BookingRepository;

@Service
public class Travel_mateService {

    private final UserRepository userRepo;
    private final PlaceRepository placeRepo;
    private final ReviewRepository reviewRepo;
    private final BookingRepository bookingRepo;

    public Travel_mateService(UserRepository userRepo,
                              PlaceRepository placeRepo,
                              ReviewRepository reviewRepo,
                              BookingRepository bookingRepo) {
        this.userRepo = userRepo;
        this.placeRepo = placeRepo;
        this.reviewRepo = reviewRepo;
        this.bookingRepo = bookingRepo;
    }

    public Travel_mateModel.User registerUser(Travel_mateModel.User user) {
        if (user.getRole() == null || user.getRole().isBlank()) {
            user.setRole("USER");
        }
        return userRepo.save(user);
    }

    public Travel_mateModel.User login(String email, String password) {
        Travel_mateModel.User user = userRepo.findByEmail(email);

        if (user != null && user.getPassword().equals(password)) {
            return user;
        }
        return null;
    }

    public Travel_mateModel.User getUserById(int id) {
        return userRepo.findById(id).orElse(null);
    }

    public List<Travel_mateModel.Place> getAllPlaces() {
        return placeRepo.findAll();
    }

    public Travel_mateModel.Place addPlace(Travel_mateModel.Place place, Travel_mateModel.User user) {
        if (!"ADMIN".equalsIgnoreCase(user.getRole())) {
            throw new RuntimeException("Only ADMIN can add places");
        }
        return placeRepo.save(place);
    }

    public Travel_mateModel.Place updatePlace(int id, Travel_mateModel.Place newPlace, Travel_mateModel.User user) {
        if (!"ADMIN".equalsIgnoreCase(user.getRole())) {
            throw new RuntimeException("Only ADMIN can update places");
        }

        Travel_mateModel.Place place = placeRepo.findById(id).orElse(null);

        if (place != null) {
            place.setName_p(newPlace.getName_p());
            place.setPrice(newPlace.getPrice());
            place.setDays(newPlace.getDays());
            place.setLocation(newPlace.getLocation());
            place.setDescription(newPlace.getDescription());
            place.setImage_url(newPlace.getImage_url());
            place.setRating(newPlace.getRating());
            return placeRepo.save(place);
        }
        return null;
    }

    public void deletePlace(int id, Travel_mateModel.User user) {
        if (!"ADMIN".equalsIgnoreCase(user.getRole())) {
            throw new RuntimeException("Only ADMIN can delete places");
        }
        placeRepo.deleteById(id);
    }

    public Travel_mateModel.Booking bookPlace(Travel_mateModel.Booking booking) {
        return bookingRepo.save(booking);
    }

    public List<Travel_mateModel.Booking> getAllBookings() {
        return bookingRepo.findAll();
    }

    public Travel_mateModel.Booking updateBooking(int id, Travel_mateModel.Booking newBooking) {
        Travel_mateModel.Booking booking = bookingRepo.findById(id).orElse(null);

        if (booking != null) {
            booking.setTravel_date(newBooking.getTravel_date());
            booking.setStatus(newBooking.getStatus());
            return bookingRepo.save(booking);
        }
        return null;
    }

    public Travel_mateModel.Review addReview(Travel_mateModel.Review review) {
        return reviewRepo.save(review);
    }

    public List<Travel_mateModel.Review> getAllReviews() {
        return reviewRepo.findAll();
    }
}