import { Form } from "@remix-run/react";

export default function navbar() {

    return (

        <div className="navbar bg-base-100">
                <ul className="menu menu-horizontal px-1 flex-auto">
                    <li className="text-xl"><a href="/">Home</a></li>
                </ul>
                <div className="flex-none">
                    <div className="form-control ">
                        <Form>
                            <div className="input-group">
                                <input type="text" placeholder="Search…" className="input input-bordered" />
                                <button className="btn btn-warning">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                                </button>
                            </div>
                        </Form>
                    </div>
                </div>
        </div>
    );

}

