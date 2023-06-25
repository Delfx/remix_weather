import { useState, useEffect } from "react";
import "./style/AddButton.css";

interface AddButtonProps {
  cityId: string;
  cityName: string;
  cityCode: string;
}

export function AddButton({ cityId, cityName, cityCode }: AddButtonProps) {
  const [alertVisible, setAlertVisible] = useState<boolean>(false);

  function addToCollection(params: any) {
    console.log("OK");
  }

  useEffect(() => {
    if (alertVisible) {
      const timer = setTimeout(() => {
        setAlertVisible(false);
      }, 3000);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [alertVisible]);

  const alertStyle: React.CSSProperties = {
    opacity: alertVisible ? 1 : 0,
    transition: "opacity 0.2s ease",
    position: alertVisible ? "absolute" : undefined,
    // left: 0,
    // top: 0,
    zIndex: alertVisible ? 9999 : -1,
  };

  return (
    <div>
      <div
        className="w-96 alert alert-success shadow-lg mt-3 mb-3"
        style={alertStyle}
      >
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current flex-shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>City Added!</span>
        </div>
      </div>

      <button className="btn btn-accent" onClick={addToCollection}>
        Add to Collection
      </button>
    </div>
  );
}
