import Head from "next/head";

import SearchIcon from "../components/SearchIcon";

export default function Home(): JSX.Element {
  return (
    <div className="mx-auto max-w-prose">
      <Head>
        <title>Scryfall Names Fetcher</title>
      </Head>

      <header className="pt-8">
        <h1 className="mb-2 text-gray-900 text-2xl font-semibold">
          Fetch card names from Scryfall
        </h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <div className="relative text-gray-400">
            <span className="absolute inset-y-0 left-0 flex items-center p-1 pl-2">
              <button type="submit" className="focus:outline-none">
                <SearchIcon />
              </button>
            </span>
            <input
              type="search"
              placeholder="Enter a Scryfall query, like t:goblin"
              className="p-2 pl-10 w-full text-gray-700 text-sm border border-gray-300 rounded focus:outline-none"
            />
          </div>
        </form>
      </header>

      <main></main>
    </div>
  );
}
