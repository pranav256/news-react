import { NavbarProps } from "../types";
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
const Navbar = ({
  setCategory,
  setCountry,
  setCountryName,
  setDarkTheme,
  darkTheme,
}: NavbarProps) => {
  return (
    <div className="sticky top-0  w-full transition-colors duration-500 backdrop-blur bg-white/75 dark:bg-gray-800/50">
      <div className="py-4 border-b border-slate-900/10 lg:px-8 dark:border-slate-300/10 mx-4">
        <div className="relative flex items-center justify-between">
          <img
            src="https://img.icons8.com/fluency/48/000000/news.png"
            alt="news"
            className="sm:mr-2 mr-0"
          />

          <nav className=" text-sm font-semibold text-slate-700 dark:text-slate-50">
            <div className="group inline-block relative sm:mx-2">
              <button className="text-gray-700 font-semibold inline-flex items-center dark:text-white">
                <span className="mr-1">Category</span>
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </button>

              <ul className=" absolute hidden text-gray-700 pt-1 group-hover:block ">
                {categoryObj.map(({ text, value }, index) => (
                  <li key={index}>
                    <button
                      onClick={() => {
                        setCategory(value);
                      }}
                      className="m-0.5 text-sm text-left rounded bg-gray-100 text-slate-800 hover:bg-gray-300 py-2 px-2 w-full dark:bg-slate-700 dark:text-white"
                    >
                      {text}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="group inline-block relative sm:mx-2">
              <button className="text-gray-700 font-semibold inline-flex items-center dark:text-white">
                <span className="mr-1">Country</span>
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </button>
              <ul className="absolute hidden text-gray-700 pt-1 group-hover:block ">
                {countryObj.map(({ text, value }, index) => (
                  <li key={index}>
                    <button
                      onClick={() => {
                        setCountry(value);
                        setCountryName(text);
                      }}
                      className="m-0.5 text-sm text-left rounded bg-gray-100 text-slate-800 hover:bg-gray-300 py-2 px-2 w-full dark:bg-slate-700 dark:text-white"
                    >
                      {text}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
          <div className="flex items-center border-l sm:ml-6 sm:pl-6 ">
            <button
              className="text-xl  rounded-full px-2 py-1 hover:shadow-lg hover:shadow-slate-900  dark:hover:shadow-slate-50"
              type="button"
              onClick={() => {
                setDarkTheme(!darkTheme);
              }}
            >
              {darkTheme ? "☀️" : "🌙"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
