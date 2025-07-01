import { CarProps, FilterProps } from "@types";

export const calculateCarRent = (city_mpg: number, year: number) => {
  const basePricePerDay = 50; // Base rental price per day in dollars
  const mileageFactor = 0.1; // Additional rate per mile driven
  const ageFactor = 0.05; // Additional rate per year of vehicle age

  // Calculate additional rate based on mileage and age
  const mileageRate = city_mpg * mileageFactor;
  const ageRate = (new Date().getFullYear() - year) * ageFactor;

  // Calculate total rental rate per day
  const rentalRatePerDay = basePricePerDay + mileageRate + ageRate;

  return rentalRatePerDay.toFixed(0);
};

export const updateSearchParams = (type: string, value: string) => {
  // Get the current URL search params
  const searchParams = new URLSearchParams(window.location.search);

  // Set the specified search parameter to the given value
  searchParams.set(type, value);

  // Set the specified search parameter to the given value
  const newPathname = `${window.location.pathname}?${searchParams.toString()}`;

  return newPathname;
};

export const deleteSearchParams = (type: string) => {
  // Set the specified search parameter to the given value
  const newSearchParams = new URLSearchParams(window.location.search);

  // Delete the specified search parameter
  newSearchParams.delete(type.toLocaleLowerCase());

  // Construct the updated URL pathname with the deleted search parameter
  const newPathname = `${
    window.location.pathname
  }?${newSearchParams.toString()}`;

  return newPathname;
};

export async function fetchCars(filters: FilterProps) {
  const { manufacturer, year, fuel, limit, model } = filters;
  const url = new URL("https://cars-by-api-ninjas.p.rapidapi.com/v1/cars");

  if (manufacturer) url.searchParams.append("make", manufacturer);
  if (year) url.searchParams.append("year", year.toString());
  if (fuel) url.searchParams.append("fuel_type", fuel);
  if (model) url.searchParams.append("model", model);

  const options = {
    method: "GET",
    headers: {
      "x-rapidapi-key": process.env.NEXT_PUBLIC_RAPID_API_KEY || "",
      "x-rapidapi-host": "cars-by-api-ninjas.p.rapidapi.com",
    },
  };

  try {
    const response = await fetch(url.toString(), options);
    const result = await response.json();
    console.log("API result:", result); // Add this line for debugging
    return result;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export const generateCarImageUrl = (car: CarProps, angle?: string) => {
  const url = new URL("https://cdn.imagin.studio/getimage");
  const { make, model, year } = car;

  url.searchParams.append(
    "customer",
    process.env.NEXT_PUBLIC_IMAGIN_API_KEY || ""
  );
  url.searchParams.append("make", make);
  url.searchParams.append("modelFamily", model.split(" ")[0]);
  url.searchParams.append("zoomType", "fullscreen");
  url.searchParams.append("modelYear", `${year}`);
  // url.searchParams.append('zoomLevel', zoomLevel);
  url.searchParams.append("angle", `${angle}`);

  return `${url}`;
};

// Example: Generate random car data using your manufacturers array

import { manufacturers } from "@constants";

// Helper to generate a random integer in a range
function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Generate mock car objects with all required CarProps fields
export const mockCars: CarProps[] = manufacturers.slice(0, 10).map((make, idx) => ({
  city_mpg: getRandomInt(15, 40),
  class: "sedan",
  combination_mpg: getRandomInt(18, 38),
  cylinders: getRandomInt(3, 8),
  displacement: parseFloat((Math.random() * 3 + 1).toFixed(1)),
  drive: ["fwd", "rwd", "awd"][getRandomInt(0, 2)],
  fuel_type: "Gas",
  highway_mpg: getRandomInt(20, 45),
  make,
  model: `Model ${String.fromCharCode(65 + idx)}`,
  transmission: Math.random() > 0.5 ? "a" : "m",
  year: getRandomInt(2015, 2023),
}));
