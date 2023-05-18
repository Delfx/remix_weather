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

  function handleSelectCity(item) {
    setSearchQuery(item);
    const form = document.querySelector("Form");
    const input = form.querySelector('input[name="cityName"]');
    input.value = item;
    form.submit();
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
            <Combobox aria-label="choose a city"   onSelect={(item) => handleSelectCity(item)}>
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
                      onSelect={() => handleSelectCity(city)}

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
