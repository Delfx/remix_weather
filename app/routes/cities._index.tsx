import { ActionArgs, json, redirect } from "@remix-run/node";
import { Form, Outlet } from "@remix-run/react";

export async function action({ request }: ActionArgs) {
  const data = await request.formData();
  const cityName = data.get("cityName");

  return redirect(`/cities/${cityName}`);
}

export default function CitiesIndex() {
  return (
    <div>
      <Outlet />      
    </div>
  );
}
