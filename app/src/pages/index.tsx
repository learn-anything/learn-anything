import React from "react";
import Header from "../components/header";
import Footer from "../components/footer";
import { Search } from "../components/icons";

const IndexPage = () => {
  return (
    <>
      <Header />
      <div>
        <form
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          {/* <Search /> */}
          <input placeholder="Search topics ..." />
        </form>
        <style jsx>{`
          input {
            outline: none;
            height: 50px;
            width: 100%;
            background: 0;
            font-size: 1rem;
            color: var(--fg);
            padding: 0 20px;
            border: 1px solid var(--lighter-gray);
          }
        `}</style>
      </div>
      {/* <Footer /> */}
    </>
  );
};

export default IndexPage;
