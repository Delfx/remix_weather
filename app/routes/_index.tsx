import { LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Card } from "./components/card";
import { useEffect, useState } from "react";
import { getSession } from "utils/session.server";

export interface Root {
  place: Place;
  forecastType: string;
  forecastCreationTimeUtc: string;
  forecastTimestamps: ForecastTimestamp[];
}

export interface Place {
  code: string;
  name: string;
  administrativeDivision: string;
  country: string;
  countryCode: string;
  coordinates: number;
}

export interface ForecastTimestamp {
  forecastTimeUtc: string;
  airTemperature: number;
  feelsLikeTemperature: number;
  windSpeed: number;
  windGust: number;
  windDirection: number;
  cloudCover: number;
  seaLevelPressure: number;
  relativeHumidity?: number;
  totalPrecipitation: number;
  conditionCode: string;
}

export const meta: V2_MetaFunction = () => {
  return [{ title: "New Remix App" }];
};

export async function loader({ request }: LoaderArgs) {

  // Retrieves the current session from the incoming request's Cookie header
  const session = await getSession(request.headers.get("Cookie"));

  // Retrieve the session value set in the previous request
  const message = session.get("success") || "No message found";


  const fetchWeatherData = async (city: string) => {
    try {
      const response = await fetch(
        `https://api.meteo.lt/v1/places/${city}/forecasts/long-term`
      );
      return response.json() as Promise<Root>;
    } catch (error) {
      console.log("Error fetching weather data: ", error);
      return null;
    }
  };

  const citiesData = [{ code: "kaunas", id: 0, name: "Kaunas" }];

  const cities = await Promise.all(
    citiesData.map(async (cityData: any) => {
      const weatherData = await fetchWeatherData(cityData.code);

      console.log(cityData);

      if (weatherData) {
        const today = new Date().toISOString().substring(0, 10);

        const todayTimestamps = weatherData.forecastTimestamps.filter(
          (forecast: ForecastTimestamp) => {
            const date = forecast.forecastTimeUtc.substring(0, 10);
            return date === today;
          }
        );

        const averageTempToday = (
          todayTimestamps.reduce((sum, forecast) => {
            return sum + forecast.airTemperature;
          }, 0) / todayTimestamps.length
        ).toFixed(1);

        return {
          id: cityData.id,
          code: cityData.code,
          name: cityData.name,
          averageTempToday: parseFloat(averageTempToday),
        };
      }

      return null;
    })
  );

  return { cities: cities.filter((city) => city !== null) };
};

export default function Index() {
  const data = useLoaderData<typeof loader>();
  const [cities, setCities] = useState(data.cities);
  const [userId, setUserId] = useState(null);

  const deleteCity = (id: string) => {
    setCities(cities.filter((city) => city?.id !== id));
  };

  return (
    <div className="">
      <div className="grid gap-5 grid-col-1 md:grid-cols-3 mt-5">
        {cities.map((cityData, index) => (
          <div key={index}>
            <Card
              id={cityData?.id} // pass the document ID here
              city={cityData?.name}
              temp={cityData?.averageTempToday}
              code={cityData?.code}
              onDelete={() => deleteCity(cityData?.id)} // pass the deleteCity function
            />
          </div>
        ))}
      </div>
    </div>
  );
}
