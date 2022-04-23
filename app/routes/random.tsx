import { Center } from "@bedrock-layout/center";
import { useLoaderData } from "@remix-run/react";
import { Box, Card, CardHeader, Header, Heading } from "grommet";
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
  const randomRestaurant =
    restaurants[Math.floor(Math.random() * restaurants.length)];

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      <Box
        direction="column"
        border={{ color: "brand", size: "large" }}
        pad="medium"
      >
        <Header background="brand">
          <Heading margin="none">Lunch randomizer</Heading>
        </Header>
        <Card height="small" width="small" background="light-1">
          <CardHeader pad="medium">{randomRestaurant.name}</CardHeader>
        </Card>
      </Box>
    </div>
  );
}
