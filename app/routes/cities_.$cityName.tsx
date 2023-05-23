import { ActionArgs, LoaderArgs, json } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import Index from "./_index";

export const loader = async ({ params }: LoaderArgs) => {
  const cityName = params.cityName;

  const responsePlaces = await fetch(`https://api.meteo.lt/v1/places/`);
  const allCities = await responsePlaces.json();

  // Search for the city in the allCities array
  const city = allCities.find((item: { code: string }) =>
    item.code.toLowerCase().includes(cityName.toLowerCase())
  );

  const response = await fetch(
    `https://api.meteo.lt/v1/places/${city.code}/forecasts/long-term`
  );
  const cityLongTermData = await response.json();

  const cityDataByDate = cityLongTermData.forecastTimestamps.filter(
    (element: any) => {
      const today = new Date().toISOString().substring(0, 10); // Get today's date
      const date = element.forecastTimeUtc.substring(0, 10);

      return date === today;
    }
  );

  function calculateAverage(cityDataByDate: any[], property: string): string {
    const sum = cityDataByDate.reduce(
      (total, forecast) => total + forecast[property],
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
    city: city.name,
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
  const data = useLoaderData<typeof loader>();

  if (!data) {
    // Handle the case where data is undefined (loading state)
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
      </div>
    </div>
  );
}
