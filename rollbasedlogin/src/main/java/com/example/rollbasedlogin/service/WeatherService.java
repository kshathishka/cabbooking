package com.example.rollbasedlogin.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.ResponseEntity;

import java.util.Map;
import java.util.List;

@Service
public class WeatherService {

    private final RestTemplate restTemplate = new RestTemplate();
    
    // OpenWeatherMap API Key - consider moving to application.properties
    private String apiKey = "44e71fd78c866dcdf957a96a8f1d9b66";

    /**
     * Get instant weather data for current location using latitude and longitude
     * No caching, instant response for live location tracking
     * 
     * @param lat Latitude of the location
     * @param lon Longitude of the location
     * @return Map containing weather data
     */
    public Map<String, Object> getCurrentLocationWeather(double lat, double lon) {
        System.out.println("⚡ INSTANT fetch for current location: lat=" + lat + ", lon=" + lon);
        
        String url = "https://api.openweathermap.org/data/2.5/weather?lat=" + lat
                   + "&lon=" + lon
                   + "&appid=" + this.apiKey
                   + "&units=metric";
  
        try {
            ResponseEntity<Map> response = this.restTemplate.getForEntity(url, Map.class);
            
            if (!response.getStatusCode().is2xxSuccessful()) {
                return Map.of("error", "Failed to get weather: " + response.getStatusCode());
            }

            Map body = response.getBody();
            if (body == null || body.isEmpty()) {
                return Map.of("error", "Empty weather data received.");
            }
            
            Map main = (Map) body.get("main");
            List<Map> weatherList = (List<Map>) body.get("weather");
            Map weather = weatherList.get(0);
            
            return Map.of(
                "city", body.get("name"),
                "temp", main.get("temp"),
                "description", weather.get("description"),
                "humidity", main.get("humidity"),
                "feelsLike", main.get("feels_like"),
                "icon", weather.get("icon")
            );

        } catch (Exception e) {
            return Map.of("error", "Error fetching weather: " + e.getMessage());
        }
    }

    /**
     * Get weather data by city name
     * 
     * @param city Name of the city
     * @return Map containing weather data
     */
    public Map<String, Object> getWeatherByCity(String city) {
        System.out.println("Fetching weather for city: " + city);
        
        String url = "https://api.openweathermap.org/data/2.5/weather?q=" + city
                   + "&appid=" + this.apiKey
                   + "&units=metric";
  
        try {
            ResponseEntity<Map> response = this.restTemplate.getForEntity(url, Map.class);
            
            if (!response.getStatusCode().is2xxSuccessful()) {
                return Map.of("error", "Failed to get weather: " + response.getStatusCode());
            }

            Map body = response.getBody();
            if (body == null || body.isEmpty()) {
                return Map.of("error", "Empty weather data received.");
            }
            
            Map main = (Map) body.get("main");
            List<Map> weatherList = (List<Map>) body.get("weather");
            Map weather = weatherList.get(0);
            
            return Map.of(
                "city", body.get("name"),
                "temp", main.get("temp"),
                "description", weather.get("description"),
                "humidity", main.get("humidity"),
                "feelsLike", main.get("feels_like"),
                "icon", weather.get("icon")
            );

        } catch (Exception e) {
            return Map.of("error", "Error fetching weather: " + e.getMessage());
        }
    }
}
