import { Form, useFetcher } from "@remix-run/react";
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from "@reach/combobox";
import "@reach/combobox/styles.css";
import {useEffect, useState } from "react";

interface City {
  code: string;
  name: string;
}

export default function Navbar() {
  const citiesFetcher = useFetcher<{ data: City[] }>(); // Add type annotation for citiesFetcher
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredCities, setFilteredCities] = useState<City[]>([]); // Add type annotation for filteredCities

  useEffect(() => {
    if (citiesFetcher.state === "idle" && citiesFetcher.data == null) {
      citiesFetcher.load("/cities/");
    }
  }, [citiesFetcher]);

  useEffect(() => {
    if (citiesFetcher.data) {
      const filtered = (citiesFetcher.data as unknown as City[]).filter(
        (city) => city.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCities(filtered);
    }
  }, [citiesFetcher.data, searchQuery]);

  function handleChange(value: string) {
    setSearchQuery(value);
    setFilteredCities(
      (citiesFetcher.data as unknown as City[]).filter((city) =>
        city.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }

  function handleSelectCity(item: string) { 
    setSearchQuery(item);
    const form = document.querySelector("Form") as HTMLFormElement;
    const input = form.querySelector(
      'input[name="cityName"]'
    ) as HTMLInputElement;
    input.value = item;
    form.submit();
  }

  return (
    <div className="navbar bg-base-100">
      <ul className="menu menu-horizontal px-1 flex-auto">
        <li className="text-xl">
          <a href="/">Home</a>
          <a href="/cities">All Cities</a>
        </li>
      </ul>

      <Form action="/cities?index" method="post" autoComplete="off">
        <div className="form-control">
          <div className="flex">
            <Combobox
              aria-label="choose a city"
              onSelect={(item: string) => handleSelectCity(item)} // Add type annotation for item
            >
              <ComboboxInput
                name="cityName"
                type="text"
                placeholder="Search For city"
                className="input input-bordered"
                onChange={(event) => handleChange(event.target.value)}
                value={searchQuery}
              />
              <ComboboxPopover>
                <ComboboxList>
                  {filteredCities.slice(0, 10).map((city) => (
                    <ComboboxOption
                      key={city.code}
                      value={city.code}
                    >
                      {city.name}
                    </ComboboxOption>
                  ))}
                </ComboboxList>
              </ComboboxPopover>
            </Combobox>
          </div>
        </div>
      </Form>
    </div>
  );
}
