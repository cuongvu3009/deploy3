import { serve } from "https://deno.land/std@0.171.0/http/server.ts";
import { configure, renderFile } from "https://deno.land/x/eta@v2.0.0/mod.ts";
import * as msgServices from "./services/msgServices.js";

// rudimentary tools:
configure({
  views: `${Deno.cwd()}/views/`,
});

const responseDetails = {
  headers: { "Content-Type": "text/html;charset=UTF-8" },
};

const redirectTo = (path) => {
  return new Response(`Redirecting to ${path}.`, {
    status: 303,
    headers: {
      "Location": path,
    },
  });
};

// controller layer:
const listRecent5msg = async (request) => {
  let recentlimit = 5;
  const data = {
    msgs: await msgServices.findRecentN(recentlimit),
  };

  return new Response(await renderFile("index.eta", data), responseDetails);
};

const addMsg = async (request) => {
  const formData = await request.formData();

  const sender = formData.get("sender");
  const message = formData.get("message");

  await msgServices.create(sender, message);

  return redirectTo("/");
};

// application layer
const handleRequest = async (request) => {
  const url = new URL(request.url);
  if (request.method === "POST") {
    return await addMsg(request);
  } else {
    return await listRecent5msg(request);
  }
};

serve(handleRequest, { port: 7777 });
