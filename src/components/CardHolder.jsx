import { useState, useEffect } from "react";
import CardItem from "./CardItem";

import Spinner from "./Spinner";
function CardHolder({ category, country }) {
  const [articles, setArticles] = useState([]);
  const [Loading, SetLoading] = useState(true);

  useEffect(() => {
    const updatePage = async () => {
      SetLoading(true);
      const url = `https://raw.githubusercontent.com/pranav256/news-api/main/${country}/${category}.json`;
      const data = await fetch(url);
      const resp = await data.json();
      window.scrollTo(0, 0);
      setArticles(resp.articles);
      SetLoading(false);
    };

    updatePage();
  }, [category, country]);

  if (Loading) return <Spinner />;
  return (
    <div>
      {articles.map((element) => {
        if (element.url === null || element.image === null) {
          return null;
        } else {
          return (
            <div key={element.title}>
              <CardItem
                imgUrl={element.urlToImage}
                title={element.title}
                description={element.description}
                published_time={element.publishedAt}
                url={element.url}
                site_name={element.author}
              ></CardItem>
            </div>
          );
        }
      })}
    </div>
  );
}

export default CardHolder;
