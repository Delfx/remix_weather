import { Outlet, useLoaderData } from "@remix-run/react";
import { Card } from "./components/card";
import { useState } from "react";

interface City {
  code: string;
  name: string;
  administrativeDivision: string;
  countryCode: string;
}

export const loader = async () => {
  const responsePlaces = await fetch(`https://api.meteo.lt/v1/places/`);
  const allCities: City[] = await responsePlaces.json();

  return allCities;
};

const ITEMS_PER_PAGE = 10;
const VISIBLE_PAGES = 5;

export default function Cities() {
  const data: City[] = useLoaderData<City[]>();
  const [currentPage, setCurrentPage] = useState(1);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentCities = data.slice(startIndex, endIndex);

  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);
  const visiblePageNumbers = calculateVisiblePageNumbers(
    currentPage,
    totalPages
  );

  function calculateVisiblePageNumbers(
    currentPage: number,
    totalPages: number
  ): number[] {
    const middlePage = Math.ceil(VISIBLE_PAGES / 2);
    let startPage = currentPage - middlePage + 1;
    startPage = Math.max(startPage, 1);
    const endPage = Math.min(startPage + VISIBLE_PAGES - 1, totalPages);
    startPage = Math.max(endPage - VISIBLE_PAGES + 1, 1);
    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  }

  return (
    <div>
      <Outlet />

      <div className="grid gap-5 grid-col-1 md:grid-cols-3 mt-5">
        {currentCities.map((city) => (
          <a href={"/cities/" + city.code} key={city.code}>
            <Card city={city.name} />
          </a>
        ))}
      </div>

      <div className="mt-5 flex justify-center pagination">
        <div className="btn-group">
          <button
            className="btn"
            disabled={currentPage === 1}
            onClick={() => handlePageChange(1)}
          >
            First
          </button>
          {visiblePageNumbers.map((pageNumber) => (
            <button
              className={`btn ${pageNumber === currentPage ? "btn-active" : ""}`}
              onClick={() => handlePageChange(pageNumber)}
              key={pageNumber}
            >
              {pageNumber}
            </button>
          ))}
          <button
            className="btn"
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(totalPages)}
          >
            Last
          </button>
        </div>
      </div>
    </div>
  );
}
