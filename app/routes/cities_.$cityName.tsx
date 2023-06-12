import { ActionArgs, LoaderArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { AddButton } from "./components/addButton";

interface City {
  code: string;
  name: string;
}

interface ForecastTimestamp {
  forecastTimeUtc: string;
  airTemperature: number;
  windSpeed: number;
  feelsLikeTemperature: number;
  cloudCover: number;
  relativeHumidity: number;
}

interface LoaderData {
  city: string;
  code: string;
  data: {
    elementName: string;
    data: string;
  }[];
}

export const loader = async ({ params }: LoaderArgs): Promise<LoaderData> => {
  const cityName = params.cityName ?? "";

  const responsePlaces = await fetch(`https://api.meteo.lt/v1/places/`);
  const allCities: City[] = await responsePlaces.json();

  // Search for the city in the allCities array
  const city = allCities.find((item: City) =>
    item.code.toLowerCase().includes(cityName.toLowerCase())
  );

  const response = await fetch(
    `https://api.meteo.lt/v1/places/${
      city?.code || "kaunas"
    }/forecasts/long-term`
  );
  const cityLongTermData: { forecastTimestamps: ForecastTimestamp[] } =
    await response.json();

  const cityDataByDate = cityLongTermData.forecastTimestamps.filter(
    (element: ForecastTimestamp) => {
      const today = new Date().toISOString().substring(0, 10); // Get today's date
      const date = element.forecastTimeUtc.substring(0, 10);

      return date === today;
    }
  );

  function calculateAverage(
    cityDataByDate: ForecastTimestamp[],
    property: keyof ForecastTimestamp
  ): string {
    const sum = cityDataByDate.reduce(
      (total, forecast) => total + Number(forecast[property]),
      0
    );
    const average = (sum / cityDataByDate.length).toFixed(1);
    return average;
  }

  const averageTempToday: string = calculateAverage(
    cityDataByDate,
    "airTemperature"
  );
  const avgWindSpeed: string = calculateAverage(cityDataByDate, "windSpeed");
  const avgFeelsLikeTemperature: string = calculateAverage(
    cityDataByDate,
    "feelsLikeTemperature"
  );
  const cloudCover: string = calculateAverage(cityDataByDate, "cloudCover");
  const avgRelativeHumidity: string = calculateAverage(
    cityDataByDate,
    "relativeHumidity"
  );

  return {
    city: city?.name || "",
    code: city?.code || "",
    data: [
      {
        elementName: "Temperature Today",
        data: averageTempToday,
      },
      {
        elementName: "Feels Like Temperature",
        data: avgFeelsLikeTemperature,
      },
      {
        elementName: "Wind Speed",
        data: avgWindSpeed,
      },
      {
        elementName: "Cloud Cover",
        data: cloudCover,
      },
      {
        elementName: "Relative Humidity",
        data: avgRelativeHumidity,
      },
    ],
  };
};

export async function action({ request }: ActionArgs) {
  console.log(request);
}

export default function CitiesName() {
  const data = useLoaderData<LoaderData>();

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mt-8">
      <div className="overflow-x-auto">
        <h1 className="text-lg mb-5 text-center">
          {" "}
          {data.city.toUpperCase()}{" "}
        </h1>
        <table className="table w-full">
          {/* head */}
          <thead>
            <tr>
              <th></th>
              <th>Average Today data</th>
              <th>Data</th>
            </tr>
          </thead>
          <tbody>
            {data.data.map((item, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{item.elementName}</td>
                <td>{item.data}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-4">
          <AddButton
            cityId={data.code}
            cityName={data.city}
            cityCode={data.code}
          />
        </div>
      </div>
    </div>
  );
}
