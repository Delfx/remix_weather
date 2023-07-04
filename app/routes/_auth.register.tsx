import { ActionFunction, ActionArgs, json, redirect } from "@remix-run/node";
import { useActionData } from "@remix-run/react";
import { withZod } from "@remix-validated-form/with-zod";
import { ValidatedForm } from "remix-validated-form";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { commitSession, getSession } from "utils/session.server";

const prisma = new PrismaClient();

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Must be a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

export const action: ActionFunction = async ({ request }: ActionArgs) => {
  const session = getSession(request.headers.get("Cookie"));
  const validator = withZod(schema);
  const validation = await validator.validate(await request.formData());

  if (validation.error) return json({ error: validation.error });

  const { name, email, password } = validation.data;

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await prisma.user.create({
    data: {
      name,
      email,
      pass: hashedPassword,
    },
  });

  if (!newUser) {
    (await session).flash("error", "Failed to create user");
    return json({ error: "Failed to create user" });
  }

  (await session).flash("success", "User created successfully!");

  return redirect("/", {
    headers: {
      "Set-Cookie": await commitSession(await session),
    },
  });
};

export default function CreateUser() {
  const { data, error } = useActionData() || {};

  return (
    <div className="bg-white lg:w-4/12 md:6/12 w-10/12 m-auto my-10 shadow-md">
      <div className="py-8 px-8 rounded-xl">
        <h1 className="font-medium text-2xl mt-3 text-center">
          Create new Account
        </h1>
        <ValidatedForm validator={withZod(schema)} method="post">
          <div className="my-5 text-sm">
            <label htmlFor="name" className="block text-black">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="rounded-sm px-4 py-3 mt-3 focus:outline-none bg-gray-100 w-full"
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
            />
          </div>

          {console.log(data)}

          {error && error.fieldErrors && (
            <div className="">
              {Object.entries(error.fieldErrors).map(([key, value], index) => (
                <div key={index} className="alert alert-error shadow-lg my-2">
                  <div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="stroke-current flex-shrink-0 h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span key={index}>{`${key}: ${value}`}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {data?.success && <div>Account created successfully!</div>}

          <button
            type="submit"
            className="block text-center text-white bg-gray-800 p-3 duration-300 rounded-sm hover:bg-black w-full"
          >
            Create user
          </button>
        </ValidatedForm>
      </div>
    </div>
  );
}
