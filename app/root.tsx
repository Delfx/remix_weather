import { cssBundleHref } from "@remix-run/css-bundle";
import { ActionArgs, LinksFunction, redirect } from "@remix-run/node";
import stylesheet from "~/tailwind.css";
import Navbar from "./routes/components/navbar"

import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
];



export default function App() {
  return (
    <html data-theme="cupcake" lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="container mx-auto m-5">
        <Navbar />
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
