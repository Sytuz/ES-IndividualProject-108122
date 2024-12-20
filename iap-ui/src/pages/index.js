import Head from "next/head";
import Navbar from "@/components/navbar";
import Image from "next/image";
import { useEffect } from "react";


export default function Home() {
  const handleGettingStarted = () => {
    // Make sure this runs only on the client-side
    if (typeof window !== "undefined") {
        window.location.href = "https://tasktracker.auth.eu-south-2.amazoncognito.com/signup?response_type=code&client_id=66v9ved46iqmn4ffs9saan6kc&redirect_uri=https://tasktracker.d2tu436vk3fvmm.amplifyapp.com/login";
    }
  };  

  return (
    <main>
      <Navbar />
      <Head>
        <title>TaskTracker</title>
        <meta name="description" content="Task tracker application" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="container d-flex flex-column justify-content-center" style={{ height: "100vh" }}>
        <div className="row justify-content-center text-center">
          <div className="col-md-3">
            <div className="image-bg" style={{ background: "linear-gradient(135deg, #fceabb, #f8b500)" }}>
              <Image src="/clipboard.png" alt="Clipboard made by Kiranshastry - Flaticon" width={85} height={85} />
            </div>
            <h5 className="mt-4">Create and manage tasks</h5>
          </div>
          <div className="col-md-3">
            <div className="image-bg" style={{ background: "linear-gradient(135deg, #d4fc79, #96e6a1)" }}>
              <Image src="/categories.png" alt="Clipboard made by Kiranshastry - Flaticon" width={85} height={85} />
            </div>
            <h5 className="mt-4">Divide tasks into categories</h5>
          </div>
          <div className="col-md-3">
            <div className="image-bg" style={{ background: "linear-gradient(135deg, #fbc2eb, #a6c1ee)" }}>
              <Image src="/deadline.png" alt="Clipboard made by Kiranshastry - Flaticon" width={85} height={85} />
            </div>
            <h5 className="mt-4">Set priorities and deadlines</h5>
          </div>
          <div className="col-md-3">
            <div className="image-bg" style={{ background: "linear-gradient(135deg, #ffecd2, #fcb69f)" }}>
              <Image src="/filter.png" alt="Clipboard made by Kiranshastry - Flaticon" width={85} height={85} />
            </div>
            <h5 className="mt-4">Filter and sort as needed</h5>
          </div>
        </div>
        <div className="row justify-content-center" style={{ marginTop: "100px" }}>
          <div className="col-auto">
            <button onClick={handleGettingStarted} className="get-started-btn nav-link py-3 px-5 px-lg-5 rounded-pill tt-bgcolor text-white fs-5 fw-bold">
              Get Started
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
