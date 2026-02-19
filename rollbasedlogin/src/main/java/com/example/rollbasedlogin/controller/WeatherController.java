package com.example.rollbasedlogin.controller;

import com.example.rollbasedlogin.service.WeatherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/weather")
public class WeatherController {

    @Autowired
    private WeatherService weatherService;

    /**
     * Get current location weather using latitude and longitude
     * Used for live location-based weather display in dashboard
     * 
     * @param lat Latitude
     * @param lon Longitude
     * @return Weather data as JSON
     */
    @GetMapping("/current")
    public Map<String, Object> getCurrentLocationWeather(
        @RequestParam double lat, 
        @RequestParam double lon) {
        System.out.println("⚡ Weather request for current location (lat: " + lat + ", lon: " + lon + ")");
        return weatherService.getCurrentLocationWeather(lat, lon);
    }

    /**
     * Get weather by city name
     * 
     * @param city City name
     * @return Weather data as JSON
     */
    @GetMapping("/city/{city}")
    public Map<String, Object> getWeatherByCity(@PathVariable String city) {
        System.out.println("Weather request for city: " + city);
        return weatherService.getWeatherByCity(city);
    }
}
