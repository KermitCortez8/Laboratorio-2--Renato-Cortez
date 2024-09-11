// This example uses image and font assets from the public folder.
import React from "react";
import { Text } from "react-native";
import satori from "satori";

import { initWasm, Resvg } from "@resvg/resvg-wasm";

function loadFont(req: Request, fontName: string) {
  return fetch(new URL(fontName, req.url)).then((res) => res.arrayBuffer());
}

export async function GET(req: Request, { post }: { post: string }) {
  const postTitle = post;

  await initWasm(
    fetch("https://unpkg.com/@resvg/resvg-wasm/index_bg.wasm").then((res) =>
      res.arrayBuffer()
    )
  );

  const svgString = await satori(
    <div
      style={{
        height: "100%",
        display: "flex",
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      <img
        width={200}
        height={200}
        src={new URL("/bacon-emoji.png", req.url).toString()}
      />
      <Text
        style={{
          display: "flex",
          color: "black",
          fontSize: 24,
        }}
      >
        {postTitle}
      </Text>
    </div>,
    {
      width: 1024,
      height: 1024,
      fonts: [
        {
          name: "custom",
          data: await loadFont(req, "/custom-font.ttf"),
          weight: 400,
          style: "normal",
        },
      ],
    }
  );

  // Convert SVG string to PNG image
  const image = new Resvg(svgString).render().asPng();

  return new Response(image, {
    headers: {
      "Content-Type": "image/png",
      "cache-control": "public, immutable, no-transform, max-age=31536000",
    },
  });
}
