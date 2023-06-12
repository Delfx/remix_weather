import { doc, deleteDoc } from "firebase/firestore";
import { dbClient } from "~/utils/db.client"; // import dbClient from db.client.js here

interface CardProps {
  id: string;
  city: string;
  temp?: number;
  code: string; 
  onDelete: () => void; 
}

export function Card({ city, temp, code, id, onDelete }: CardProps) {
  const deleteCity = async () => {
    const documentRef = doc(dbClient, "cities", id);
    try {
      await deleteDoc(documentRef);
      onDelete(); // call the onDelete function after city is deleted
    } catch (error) {
      console.error("Error removing document: ", error);
    }
  };
  
  return (
    <div className="card w-100 md:w-62 lg:w-72 xl:w-96 bg-secondary text-primary-content mx-auto">
      <div className="card-body">
        {temp ? (
          <div className="flex justify-end">
            <button
              className="btn btn-square btn-outline btn-xs"
              onClick={deleteCity}
            >
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        ) : null}
        <h2 className="card-title">{city}</h2>
        {temp ? (
          <p>Average Temperature {temp}</p>
        ) : (
          <div className="card-actions justify-end"></div>
        )}
      </div>
    </div>
  );
}
