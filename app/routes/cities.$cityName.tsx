import { LoaderArgs, json } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import Index from "./_index";

export const loader = async ({ params }: LoaderArgs) => {

    const cityName = params.cityName;

    const responsePlaces = await fetch(`https://api.meteo.lt/v1/places/`);
    const allCities = await responsePlaces.json();

    // Search for the city in the allCities array
    const city = allCities.find((item: { code: string; }) => item.code.toLowerCase().includes(cityName.toLowerCase()));    

    const response = await fetch(`https://api.meteo.lt/v1/places/${city.code}/forecasts/long-term`);
    const cityLongTermData = await response.json();

    const cityDataByDate = cityLongTermData.forecastTimestamps.filter((element: any) => {
        const today = new Date().toISOString().substring(0, 10); // Get today's date
        const date = element.forecastTimeUtc.substring(0, 10);

        return date === today
    });


    const averageTempToday = (cityDataByDate.reduce((sum: any, forecast: any) => {
        return sum + forecast.airTemperature;
    }, 0) / cityDataByDate.length).toFixed(1);

    const avgWindSpeed = (cityDataByDate.reduce((sum: any, forecast: any) => {
        return sum + forecast.windSpeed;
    }, 0) / cityDataByDate.length).toFixed(1);

    const avgFeelsLikeTemperature = (cityDataByDate.reduce((sum: any, forecast: any) => {
        return sum + forecast.feelsLikeTemperature;
    }, 0) / cityDataByDate.length).toFixed(1);

    const cloudCover = (cityDataByDate.reduce((sum: any, forecast: any) => {
        return sum + forecast.cloudCover;
    }, 0) / cityDataByDate.length).toFixed(1);

    const avgRelativeHumidity = (cityDataByDate.reduce((sum: any, forecast: any) => {
        return sum + forecast.relativeHumidity;
    }, 0) / cityDataByDate.length).toFixed(1);


    return ({
        city: city.name,
        data: [
            {
                elementName: 'Temperature Today',
                data: averageTempToday,
            },
            {
                elementName: 'Feels Like Temperature',
                data: avgFeelsLikeTemperature,
            },
            {
                elementName: 'Wind Speed',
                data: avgWindSpeed,
            },
            {
                elementName: 'Cloud Cover',
                data: cloudCover,
            },
            {
                elementName: 'Relative Humidity',
                data: avgRelativeHumidity,
            },
        ]
    });
}


export default function Root() {
    const data = useLoaderData<typeof loader>();

    if (!data) {
        // Handle the case where data is undefined (loading state)
        return <div>Loading...</div>;
    }

    return (
        <div className="mt-8">
            <div className="overflow-x-auto">
                <h1 className="text-lg mb-5 text-center"> {(data.city).toUpperCase()} </h1>
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