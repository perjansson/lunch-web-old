import { useLoaderData } from "@remix-run/react";
import { Box, Card, CardHeader, Header, Heading } from "grommet";
import { useEffect, useState } from "react";
import type { Restaurant } from "~/types";
import { getAllRestaurants } from "~/utils/supabase";

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

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      <Header background="brand">
        <Heading margin="none">Lunch randomizer</Heading>
      </Header>
      <Box
        direction="column"
        border={{ color: "brand", size: "large" }}
        pad="medium"
      >
        {randomRestaurant && (
          <Card height="small" width="small" background="light-1">
            <CardHeader pad="medium">{randomRestaurant.name}</CardHeader>
          </Card>
        )}
      </Box>
    </div>
  );
}
