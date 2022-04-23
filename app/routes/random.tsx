import { useLoaderData } from "@remix-run/react";
import supabase from "~/utils/supabase";

export const loader = async () => {
  const { data: restaurants, error } = await supabase
    .from("Restaurant")
    .select("*");

  if (error) {
    console.error("Error getting restaurants from Supabase", error.message);
  }

  return {
    restaurants,
  };
};

export default function Index() {
  const { restaurants } = useLoaderData();

  return (
    <>
      <h1>Lunch randomizer</h1>
      {restaurants.map((restaurant) => (
        <section key={restaurant.id}>{restaurant.name}</section>
      ))}
    </>
  );
}
