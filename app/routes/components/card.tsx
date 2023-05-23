interface CardProps {
    city: string;
    temp?: number;
  }
  
  export function Card({ city, temp }: CardProps) {
    return (
      <div className="card w-100 md:w-62 lg:w-72 xl:w-96 bg-secondary text-primary-content mx-auto">
        <div className="card-body">
          <h2 className="card-title">{city}</h2>
          {temp ? (
            <p>Average Temperature {temp}</p>
          ) : (
            <p>No data for temperature</p>
          )}
        </div>
      </div>
    );
  }
  