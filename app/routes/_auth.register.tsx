import { ActionFunction, ActionArgs, redirect } from "@remix-run/node";
import { Form } from "@remix-run/react";
import  bcrypt  from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const action: ActionFunction = async ({ request }: ActionArgs) => {
  if (request.method === "POST") {
    const formData = await request.formData();

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    // Hash the password using bcryptjs
    const hashedPassword = await bcrypt.hash(password || "", 10);

    // Save the user to the database using Prisma
    await prisma.user.create({
      data: {
        name: name || "",
        email: email || "",
        pass: hashedPassword,
      },
    });

    // Redirect to a success page or any other desired route
    return redirect("/");
  }

  return redirect("/"); // Redirect to the main page if the request method is not POST
};

export default function CreateUser() {
  return (
    <div className="bg-white lg:w-4/12 md:6/12 w-10/12 m-auto my-10 shadow-md">
      <div className="py-8 px-8 rounded-xl">
        <h1 className="font-medium text-2xl mt-3 text-center">
          Create new Account
        </h1>

        <Form method="post" className="mt-6">
          <div className="my-5 text-sm">
            <label htmlFor="name" className="block text-black">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="rounded-sm px-4 py-3 mt-3 focus:outline-none bg-gray-100 w-full"
              placeholder="Name"
            />
          </div>
          <div className="my-5 text-sm">
            <label htmlFor="email" className="block text-black">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="rounded-sm px-4 py-3 mt-3 focus:outline-none bg-gray-100 w-full"
              placeholder="Email"
            />
          </div>
          <div className="my-5 text-sm">
            <label htmlFor="password" className="block text-black">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="rounded-sm px-4 py-3 mt-3 focus:outline-none bg-gray-100 w-full"
              placeholder="Password"
            />
          </div>

          <button
            type="submit"
            className="block text-center text-white bg-gray-800 p-3 duration-300 rounded-sm hover:bg-black w-full"
          >
            Create user
          </button>
        </Form>
      </div>
    </div>
  );
}
