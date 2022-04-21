const categoryObj = [
  { text: "General", value: "general" },
  { text: "Business", value: "business" },
  { text: "Technology", value: "technology" },
  { text: "Entertainment", value: "entertainment" },
  { text: "Science", value: "science" },
  { text: "Health", value: "health" },
  { text: "Sports", value: "sports" },
];

const countryObj = [
  { text: "India", value: "in" },
  { text: "United States", value: "us" },
  { text: "United Kingdom", value: "gb" },
];
const Navbar = ({ setCategory, setCountry, setCountryName }) => {
  return (
    <div className="sticky top-0  w-full backdrop-blur flex-none transition-colors duration-500 lg:z-50 lg:border-b lg:border-slate-900/10 dark:border-slate-50/[0.06] bg-white/75 supports-backdrop-blur:bg-white/10 ">
      <div className="py-4 border-b border-slate-900/10 lg:px-8 lg:border-0 dark:border-slate-300/10 mx-4 lg:mx-0">
        <div className="relative flex items-center">
          <img
            src="https://img.icons8.com/fluency/48/000000/news.png"
            alt="news"
            className="mr-2"
          />

          <nav className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            <div className="group inline-block relative mx-2 ">
              <button className="text-gray-700 font-semibold inline-flex items-center ">
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
                {categoryObj.map(({ text, value }, index) => (
                  <li key={index}>
                    <button
                      onClick={() => {
                        setCategory(value);
                      }}
                      className="m-0.5 text-sm text-left rounded bg-gray-100 text-slate-800 hover:bg-gray-300 py-2 px-2 w-full"
                    >
                      {text}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="group inline-block relative mx-2">
              <button className="text-gray-700 font-semibold inline-flex items-center">
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
                {countryObj.map(({ text, value }, index) => (
                  <li key={index}>
                    <button
                      onClick={() => {
                        setCountry(value);
                        setCountryName(text);
                      }}
                      className="m-0.5 text-sm text-left rounded bg-gray-100 text-slate-800 hover:bg-gray-300 py-2 px-2 w-full"
                    >
                      {text}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
          <div className="flex items-center border-l border-slate-400 ml-6 pl-6 dark:border-slate-800">
            <button type="button">
              <span>
                <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M17.715 15.15A6.5 6.5 0 0 1 9 6.035C6.106 6.922 4 9.645 4 12.867c0 3.94 3.153 7.136 7.042 7.136 3.101 0 5.734-2.032 6.673-4.853Z"
                    className="fill-transparent"
                  ></path>
                  <path
                    d="m17.715 15.15.95.316a1 1 0 0 0-1.445-1.185l.495.869ZM9 6.035l.846.534a1 1 0 0 0-1.14-1.49L9 6.035Zm8.221 8.246a5.47 5.47 0 0 1-2.72.718v2a7.47 7.47 0 0 0 3.71-.98l-.99-1.738Zm-2.72.718A5.5 5.5 0 0 1 9 9.5H7a7.5 7.5 0 0 0 7.5 7.5v-2ZM9 9.5c0-1.079.31-2.082.845-2.93L8.153 5.5A7.47 7.47 0 0 0 7 9.5h2Zm-4 3.368C5 10.089 6.815 7.75 9.292 6.99L8.706 5.08C5.397 6.094 3 9.201 3 12.867h2Zm6.042 6.136C7.718 19.003 5 16.268 5 12.867H3c0 4.48 3.588 8.136 8.042 8.136v-2Zm5.725-4.17c-.81 2.433-3.074 4.17-5.725 4.17v2c3.552 0 6.553-2.327 7.622-5.537l-1.897-.632Z"
                    className="fill-slate-400 dark:fill-slate-500"
                  ></path>
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M17 3a1 1 0 0 1 1 1 2 2 0 0 0 2 2 1 1 0 1 1 0 2 2 2 0 0 0-2 2 1 1 0 1 1-2 0 2 2 0 0 0-2-2 1 1 0 1 1 0-2 2 2 0 0 0 2-2 1 1 0 0 1 1-1Z"
                    className="fill-slate-400 dark:fill-slate-500"
                  ></path>
                </svg>
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;

// <span className="dark:hidden">
//   <svg
//     viewBox="0 0 24 24"
//     fill="none"
//     stroke-width="2"
//     stroke-linecap="round"
//     stroke-linejoin="round"
//     className="w-6 h-6"
//   >
//     <path
//       d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
//       className="stroke-slate-400 dark:stroke-slate-500"
//     ></path>
//     <path
//       d="M12 4v1M17.66 6.344l-.828.828M20.005 12.004h-1M17.66 17.664l-.828-.828M12 20.01V19M6.34 17.664l.835-.836M3.995 12.004h1.01M6 6l.835.836"
//       className="stroke-slate-400 dark:stroke-slate-500"
//     ></path>
//   </svg>
// </span>;
