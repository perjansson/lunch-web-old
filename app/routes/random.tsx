import { useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";

import type { Restaurant } from "~/types";
import { getAllRestaurants } from "~/utils/supabase";

import styles from "~/styles/random.css";

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}

interface LoaderData {
  restaurants: Restaurant[] | null;
}

export const loader = async () => {
  const { data: restaurants, error } = await getAllRestaurants();

  if (error) {
    console.error("Error getting restaurants from Supabase", error.message);
  }

  return {
    restaurants,
  };
};

export default function Index() {
  const { restaurants } = useLoaderData<LoaderData>();
  const [randomRestaurant, setRandomRestaurant] = useState<
    Restaurant | undefined
  >();

  useEffect(() => {
    if (randomRestaurant || !restaurants) {
      return;
    }

    setRandomRestaurant(
      restaurants[Math.floor(Math.random() * restaurants.length)]
    );
  }, [randomRestaurant, restaurants]);

  if (!randomRestaurant) {
    return null;
  }

  return (
    <section className="container">
      <h1>{randomRestaurant.name}</h1>
      <address>{randomRestaurant.address}</address>
    </section>
  );
}
