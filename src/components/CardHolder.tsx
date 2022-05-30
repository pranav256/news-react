import { useState, useEffect } from "react";
import CardItem from "./CardItem";
import { CardHolderProps, ArticlesType } from "../types";
import Spinner from "./Spinner";

function CardHolder({ category, country }: CardHolderProps) {
  const [articles, setArticles] = useState([]);
  const [Loading, setLoading] = useState(true);

  useEffect(() => {
    const updatePage = async () => {
      setLoading(true);
      const url = `https://raw.githubusercontent.com/pranav256/news-api/main/${country}/${category}.json`;
      const data = await fetch(url);
      const resp = await data.json();
      window.scrollTo(0, 0);
      setArticles(resp.articles);
      setLoading(false);
    };
    updatePage();
  }, [category, country]);

  if (Loading) return <Spinner />;
  return (
    <div>
      {articles.map((element: ArticlesType) => {
        if (element.url === null || element.urlToImage === null) {
          return null;
        } else {
          return (
            <div key={element.title}>
              <CardItem
                urlToImage={element.urlToImage}
                title={element.title}
                description={element.description}
                publishedAt={element.publishedAt}
                url={element.url}
                author={element.author}
              ></CardItem>
            </div>
          );
        }
      })}
    </div>
  );
}

export default CardHolder;
