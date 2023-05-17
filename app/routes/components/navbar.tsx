import { Form, useFetcher } from "@remix-run/react";
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from "@reach/combobox";
import "@reach/combobox/styles.css";
import { useEffect, useState } from "react";

export default function Navbar() {
  const citiesFetcher = useFetcher();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCities, setFilteredCities] = useState([]);

  useEffect(() => {
    if (citiesFetcher.state === "idle" && citiesFetcher.data == null) {
      citiesFetcher.load("/cities/");
    }
  }, [citiesFetcher]);

  useEffect(() => {
    if (citiesFetcher.data) {
      const filtered = citiesFetcher.data.filter((city) =>
        city.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCities(filtered);
    }
  }, [citiesFetcher.data, searchQuery]);

  function handleChange(value) {
    setSearchQuery(value);
    setFilteredCities(
      citiesFetcher.data.filter((city) =>
        city.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }

  return (
    <div className="navbar bg-base-100">
      <ul className="menu menu-horizontal px-1 flex-auto">
        <li className="text-xl">
          <a href="/">Home</a>
        </li>
      </ul>

      <Form action="/cities?index" method="post" autoComplete="off">
        <div className="form-control">
          <div className="flex">
            <Combobox aria-label="choose a city">
              <ComboboxInput
                name="cityName"
                type="text"
                placeholder="Search For city"
                className="input input-bordered"
                onChange={(event) => handleChange(event.target.value)}
              />
              <ComboboxPopover>
                <ComboboxList>
                  {filteredCities.slice(0, 10).map((city) => (
                    <ComboboxOption key={city.code} value={city.code}>
                      {city.name}
                    </ComboboxOption>
                  ))}
                </ComboboxList>
              </ComboboxPopover>
            </Combobox>

            <button type="submit" className="btn ml-2 btn-square">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </div>
        </div>
      </Form>
    </div>
  );
}
