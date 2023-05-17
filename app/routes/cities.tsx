import { json } from "@remix-run/node";
import { Form, Outlet } from "@remix-run/react";

export const loader = async () => {
  const responsePlaces = await fetch(`https://api.meteo.lt/v1/places/`);
  const allCities = await responsePlaces.json();

  return allCities;
};

export default function Cities() {
  return (
    <div>
      <Outlet />
    </div>
  );
}
