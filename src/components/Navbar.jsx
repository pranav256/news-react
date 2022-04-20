const Navbar = ({ setCategory, setCountry, setCountryName }) => {
  return (
    <nav className="p-2 flex flex-row align-text-bottom  bg-gray-100">
      <img
        src="https://img.icons8.com/fluency/48/000000/news.png"
        alt="news"
        className="mx-2"
      />

      <div className="group inline-block relative m-1">
        <button className="bg-gray-100  text-gray-700 font-semibold py-2 px-4 rounded inline-flex items-center">
          <span className="mr-1">Category</span>
          <svg
            className="fill-current h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
          </svg>
        </button>

        <ul className="absolute hidden text-gray-700 pt-1 group-hover:block">
          <li>
            <button
              onClick={() => {
                setCategory("general");
              }}
              className="m-0.5 text-left rounded bg-gray-200 text-slate-800 hover:bg-gray-300 py-2 px-4 w-full"
            >
              General
            </button>
          </li>
          <li>
            <button
              onClick={() => {
                setCategory("business");
              }}
              className="m-0.5 text-left rounded bg-gray-200 text-slate-800 hover:bg-gray-300 py-2 px-4 w-full"
            >
              Business
            </button>
          </li>
          <li>
            <button
              onClick={() => {
                setCategory("technology");
              }}
              className="m-0.5 text-left rounded bg-gray-200 text-slate-800 hover:bg-gray-300 py-2 px-4 w-full"
            >
              Technology
            </button>
          </li>
          <li>
            <button
              onClick={() => {
                setCategory("entertainment");
              }}
              className="m-0.5 text-left rounded bg-gray-200 text-slate-800 hover:bg-gray-300 py-2 px-4 w-full"
            >
              Entertainment
            </button>
          </li>
          <li>
            <button
              onClick={() => {
                setCategory("science");
              }}
              className="m-0.5 text-left rounded bg-gray-200 text-slate-800 hover:bg-gray-300 py-2 px-4 w-full"
            >
              Science
            </button>
          </li>
          <li>
            <button
              onClick={() => {
                setCategory("health");
              }}
              className="m-0.5 text-left rounded bg-gray-200 text-slate-800 hover:bg-gray-300 py-2 px-4 w-full"
            >
              Health
            </button>
          </li>
          <li>
            <button
              onClick={() => {
                setCategory("sports");
              }}
              className="m-0.5 text-left rounded bg-gray-200 text-slate-800 hover:bg-gray-300 py-2 px-4 w-full"
            >
              Sports
            </button>
          </li>
        </ul>
      </div>

      <div className="group inline-block relative m-1">
        <button className="bg-gray-100 text-gray-700 font-semibold py-2 px-4 rounded inline-flex items-center">
          <span className="mr-1">Country</span>
          <svg
            className="fill-current h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
          </svg>
        </button>
        <ul className="absolute hidden text-gray-700 pt-1 group-hover:block">
          <li>
            <button
              onClick={() => {
                setCountry("in");
                setCountryName("India");
              }}
              className="m-1 text-left rounded bg-gray-200 text-slate-800 hover:bg-gray-300 py-2 px-4 w-full"
            >
              India
            </button>
          </li>
          <li>
            <button
              onClick={() => {
                setCountry("us");
                setCountryName("United States");
              }}
              className="m-1 text-left rounded bg-gray-200 text-slate-800 hover:bg-gray-300 py-2 px-4 w-full"
            >
              US
            </button>
          </li>
          <li>
            <button
              onClick={() => {
                setCountry("gb");
                setCountryName("United Kingdom");
              }}
              className="m-1 text-left rounded bg-gray-200 text-slate-800 hover:bg-gray-300 py-2 px-4 w-full"
            >
              UK
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
