import { V2_MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Card } from "./components/card";

let citiesMap: string[] = ["vilnius", "kaunas", "klaipeda"];

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
  const fetchPromises = citiesMap.map(async (city) => {
    const response = await fetch(
      `https://api.meteo.lt/v1/places/${city}/forecasts/long-term`
    );
    return response.json() as Promise<Root>;
  });

  const citiesData = await Promise.all(fetchPromises);

  const cities = citiesData.map((cityData) => {
    const today = new Date().toISOString().substring(0, 10); // Get today's date

    const todayTimestamps = cityData.forecastTimestamps.filter(
      (forecast: ForecastTimestamp) => {
        const date = forecast.forecastTimeUtc.substring(0, 10); // Extract date from forecast timestamp
        return date === today;
      }
    );

    const averageTempToday = (
      todayTimestamps.reduce((sum, forecast) => {
        return sum + forecast.airTemperature;
      }, 0) / todayTimestamps.length
    ).toFixed(1);

    return {
      code: cityData.place.code,
      name: cityData.place.name,
      averageTempToday: parseFloat(averageTempToday),
    };
  });

  return { cities };
};

export default function Index() {
  const data = useLoaderData<typeof loader>();

  return (
    <div className="">
      <div className="grid gap-5 grid-col-1 md:grid-cols-3 mt-5">
        {data.cities.map((cityData, index) => (
          <div key={index}>
            <a href={"/cities/" + cityData.code}>
              <Card city={cityData.name} temp={cityData.averageTempToday} />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
