export type SocialMediaLinksProps = {
  url: string;
  title: string;
};
export type CardHolderProps = {
  category: string;
  country: string;
};

export type ArticlesType = {
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: Date;
  author: string;
};
export type NavbarProps = {
  setCategory: (category: string) => void;
  setDarkTheme: (darkTheme: boolean) => void;
  setCountry: (country: string) => void;
  setCountryName: (countryName: string) => void;
  darkTheme: boolean;
};
