"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import {
  CardHeader,
  Card,
  CardDescription,
  CardContent,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CloudIcon, MapPinIcon, ThermometerIcon } from "lucide-react";

interface WeatherData {
  temperature: number;
  description: string;
  location: string;
  unit: string;
}

export default function WeatherWidget() {
  const [location, setLocation] = useState<string>("");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSearch = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmedLocation = location.trim();
    if (trimmedLocation === "") {
      setError("Please Enter a Valid Location.");
      setWeather(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://api.weatherapi.com/v1/current.json?key=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}&q=${trimmedLocation}`
      );

      if (!response.ok) {
        setWeather(null);
        throw new Error(
          response.status === 404
            ? "City not found"
            : "Failed to fetch weather data"
        );
      }

      const data = await response.json();
      setWeather({
        temperature: data.current.temp_c,
        description: data.current.condition.text,
        location: data.location.name,
        unit: "°C",
      });
    } catch (error: any) {
      setError(error.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  function getTemperatureMessage(temperature: number, unit: string): string {
    if (unit === "C") {
      if (temperature < 0) {
        return `It's freezing at ${temperature}℃! Bundle up!`;
      } else if (temperature <= 15) {
        return `It's quite chilly at ${temperature}℃. You might need a jacket.`;
      } else if (temperature <= 25) {
        return `The temperature is moderate at ${temperature}℃. Enjoy the day!`;
      } else {
        return `It's warm at ${temperature}℃. Stay cool!`;
      }
    } else {
      return `${temperature} ${unit}`;
    }
  }

  function getWeatherMessage(description: string): string {
    switch (description.toLowerCase()) {
      case "sunny":
        return "It is a beautiful sunny day.";
      case "clear":
        return "The sky is clear with plenty of sunshine.";
      case "partly cloudy":
        return "The sky is partly cloudy with some sunshine.";
      case "cloudy":
        return "It's cloudy today, with overcast skies.";
      case "overcast":
        return "The sky is completely overcast with no sunshine.";
      case "rainy":
        return "It's rainy outside, so you might need an umbrella.";
      case "drizzle":
        return "There's a light drizzle outside. You might want a raincoat.";
      case "stormy":
        return "There's a storm brewing, stay safe indoors!";
      case "thunderstorm":
        return "Thunderstorms are in the area, best to stay indoors!";
      case "snowy":
        return "It's snowing outside, perfect for some winter fun.";
      case "sleet":
        return "Sleet is falling, so roads might be slippery.";
      case "hail":
        return "There's hail outside, stay under shelter!";
      case "windy":
        return "It's windy today, hold onto your hat!";
      case "breezy":
        return "A gentle breeze is blowing, quite refreshing.";
      case "foggy":
        return "The fog is thick, so drive carefully.";
      case "mist":
        return "There's a mist in the air, reducing visibility.";
      case "haze":
        return "Hazy conditions today, so visibility might be low.";
      case "smoke":
        return "There's smoke in the air. Limit your time outside if possible.";
      case "blizzard":
        return "A blizzard is raging, stay warm and indoors!";
      case "dust":
        return "Dusty conditions, best to stay inside if you have allergies.";
      default:
        return "Weather description not recognized. Please try again.";
    }
  }

  function getLocationMessage(location: string): string {
    const currentHour = new Date().getHours();
    const isNight = currentHour >= 18 || currentHour <= 6;
    return `${location} ${isNight ? "at night" : "During the Day"}`;
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-r from-[#F7971E] to-[#FFD200]">
      <Card className="w-full max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-800">
            Weather Widget
          </CardTitle>
          <CardDescription className="text-gray-600">
            Enter a city name to get the current weather.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex items-center gap-2">
            <Input
              type="text"
              placeholder="Enter City Name"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="border border-gray-300 rounded-lg p-2 shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <Button
              type="submit"
              disabled={isLoading}
              className={`rounded-lg shadow-md transition duration-300 ease-in-out ${
                isLoading
                  ? "bg-gray-400"
                  : "bg-gradient-to-r from-[#F7971E] to-[#FFD200] hover:from-[#F7971E]/80 hover:to-[#FFD200]/80"
              }`}
            >
              {" "}
              {isLoading ? "Loading..." : "Search"}
            </Button>
          </form>
          {error && <div className="mt-4 text-red-500">{error}</div>}
          {weather && (
            <div className="mt-4 grid gap-2">
              <div className="flex items-center gap-2 text-gray-700">
                <ThermometerIcon className="w-6 h-6" />
                {getTemperatureMessage(weather.temperature, weather.unit)}
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <CloudIcon className="w-6 h-6" />
                {getWeatherMessage(weather.description)}
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <MapPinIcon className="w-6 h-6" />
                {getLocationMessage(weather.location)}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
