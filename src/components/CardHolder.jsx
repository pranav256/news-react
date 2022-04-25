import { useState, useEffect } from "react";
import CardItem from "./CardItem";

import Spinner from "./Spinner";
function CardHolder({ category, country }) {
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
      {articles.map((element) => {
        if (element.url === null || element.urlToImage === null) {
          return null;
        } else {
          return (
            <div key={element.title}>
              <CardItem
                imgUrl={element.urlToImage}
                title={element.title}
                description={element.description}
                publishedTime={element.publishedAt}
                url={element.url}
                siteName={element.author}
              ></CardItem>
            </div>
          );
        }
      })}
    </div>
  );
}

export default CardHolder;
