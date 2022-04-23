import { Center } from "@bedrock-layout/center";
import { PadBox } from "@bedrock-layout/padbox";
import { Reel } from "@bedrock-layout/reel";
import { Link } from "@remix-run/react";

const pages = ["random"];

export default function Index() {
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      <Center maxWidth="90%">
        <h1 style={{ textAlign: "center" }}>Where to have lunch?</h1>
        <Reel snapType="none" gutter="lg">
          {pages.map((page) => (
            <PadBox
              key={page}
              style={{
                border: "1px solid black",
              }}
              padding="10%"
            >
              <Link to={page}>{capitalizeFirstLetter(page)}</Link>
            </PadBox>
          ))}
        </Reel>
      </Center>
    </div>
  );
}

function capitalizeFirstLetter(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
