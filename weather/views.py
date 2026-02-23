import requests
from django.shortcuts import render
from django.conf import settings


def weather_view(request):
    weather_data = None

    if request.method == "POST":
        city = request.POST.get("city")

        if city:
            API_KEY = settings.WEATHER_API_KEY  # 🔥 Get from Render env variable

            # 🌤 Current Weather
            cur_url = f"https://api.openweathermap.org/data/2.5/weather?q={city}&appid={API_KEY}&units=metric"
            cur_res = requests.get(cur_url)
            cur_data = cur_res.json()

            if cur_res.status_code != 200:
                weather_data = {
                    "error": cur_data.get("message", "City not found")
                }
                return render(request, "weather.html", {"weather": weather_data})

            # Extract current data
            weather_data = {
                "city": city.title(),
                "temp": cur_data["main"]["temp"],
                "feels_like": cur_data["main"]["feels_like"],
                "description": cur_data["weather"][0]["description"],
                "icon": cur_data["weather"][0]["icon"],
                "humidity": cur_data["main"]["humidity"],
                "wind": cur_data["wind"]["speed"],
            }

            # 📅 5-day Forecast
            forecast_url = f"https://api.openweathermap.org/data/2.5/forecast?q={city}&appid={API_KEY}&units=metric"
            f_res = requests.get(forecast_url)
            f_data = f_res.json()

            if f_res.status_code == 200:
                weather_data["forecast"] = f_data["list"]
            else:
                weather_data["forecast_error"] = f_data.get("message", "Cannot fetch forecast")

        else:
            weather_data = {"error": "Please enter a city name"}

    return render(request, "weather.html", {"weather": weather_data})