package com1.Travel_mate.model;

import jakarta.persistence.*;
import java.util.Date;

public class Travel_mateModel {

    @Entity
    @Table(name = "USERS")
    public static class User {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private int id_u;

        private String f_name_u;
        private String l_name_u;

        @Column(unique = true)
        private String email;

        private String password;
        private String role;
        private String contact_number;

        public int getId_u() {
            return id_u;
        }

        public void setId_u(int id_u) {
            this.id_u = id_u;
        }

        public String getF_name_u() {
            return f_name_u;
        }

        public void setF_name_u(String f_name_u) {
            this.f_name_u = f_name_u;
        }

        public String getL_name_u() {
            return l_name_u;
        }

        public void setL_name_u(String l_name_u) {
            this.l_name_u = l_name_u;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }

        public String getRole() {
            return role;
        }

        public void setRole(String role) {
            this.role = role;
        }

        public String getContact_number() {
            return contact_number;
        }

        public void setContact_number(String contact_number) {
            this.contact_number = contact_number;
        }
    }

    @Entity
    @Table(name = "PLACES")
    public static class Place {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private int id_p;

        private String name_p;
        private int price;
        private int days;
        private String location;

        @Column(length = 500)
        private String description;

        private String image_url;
        private double rating;

        public int getId_p() {
            return id_p;
        }

        public void setId_p(int id_p) {
            this.id_p = id_p;
        }

        public String getName_p() {
            return name_p;
        }

        public void setName_p(String name_p) {
            this.name_p = name_p;
        }

        public int getPrice() {
            return price;
        }

        public void setPrice(int price) {
            this.price = price;
        }

        public int getDays() {
            return days;
        }

        public void setDays(int days) {
            this.days = days;
        }

        public String getLocation() {
            return location;
        }

        public void setLocation(String location) {
            this.location = location;
        }

        public String getDescription() {
            return description;
        }

        public void setDescription(String description) {
            this.description = description;
        }

        public String getImage_url() {
            return image_url;
        }

        public void setImage_url(String image_url) {
            this.image_url = image_url;
        }

        public double getRating() {
            return rating;
        }

        public void setRating(double rating) {
            this.rating = rating;
        }
    }

    @Entity
    @Table(name = "REVIEWS")
    public static class Review {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private int id;

        private int user_id;
        private int place_id;

        @Column(length = 500)
        private String comment;

        private double rating;

        public int getId() {
            return id;
        }

        public void setId(int id) {
            this.id = id;
        }

        public int getUser_id() {
            return user_id;
        }

        public void setUser_id(int user_id) {
            this.user_id = user_id;
        }

        public int getPlace_id() {
            return place_id;
        }

        public void setPlace_id(int place_id) {
            this.place_id = place_id;
        }

        public String getComment() {
            return comment;
        }

        public void setComment(String comment) {
            this.comment = comment;
        }

        public double getRating() {
            return rating;
        }

        public void setRating(double rating) {
            this.rating = rating;
        }
    }

    @Entity
    @Table(name = "BOOKINGS")
    public static class Booking {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private int id_b;

        private int user_id;
        private int place_id;

        @Temporal(TemporalType.DATE)
        private Date booking_date;

        @Temporal(TemporalType.DATE)
        private Date travel_date;

        private String status;

        public int getId_b() {
            return id_b;
        }

        public void setId_b(int id_b) {
            this.id_b = id_b;
        }

        public int getUser_id() {
            return user_id;
        }

        public void setUser_id(int user_id) {
            this.user_id = user_id;
        }

        public int getPlace_id() {
            return place_id;
        }

        public void setPlace_id(int place_id) {
            this.place_id = place_id;
        }

        public Date getBooking_date() {
            return booking_date;
        }

        public void setBooking_date(Date booking_date) {
            this.booking_date = booking_date;
        }

        public Date getTravel_date() {
            return travel_date;
        }

        public void setTravel_date(Date travel_date) {
            this.travel_date = travel_date;
        }

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }
    }
}