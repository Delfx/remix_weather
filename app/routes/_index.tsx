import { V2_MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Card } from "./components/card";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "~/utils/db.server";

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

export const loader = async () => {
  const fetchDataFromFirestore = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "cities"));
      const data = querySnapshot.docs.map((doc) => doc.data());
      return data;
    } catch (error) {
      console.log("Error fetching data from Firestore: ", error);
      return [];
    }
  };

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

  const citiesData = await fetchDataFromFirestore();

  const cities = await Promise.all(
    citiesData.map(async (cityData: any) => {
      const weatherData = await fetchWeatherData(cityData.code);

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

  return (
    <div className="">
      <div className="grid gap-5 grid-col-1 md:grid-cols-3 mt-5">
        {data.cities.map((cityData, index) => (
          <div key={index}>
            <a href={"/cities/" + cityData?.code}>
              <Card city={cityData?.name} temp={cityData?.averageTempToday} />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
