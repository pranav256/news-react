import CardItem from "./CardItem";
import "./css/CardHolder.css";
function CardHolder({ articles }) {
  return (
    <div className="container">
      {articles.map((element) => {
        if (element.url === null || element.image === null) {
          return null;
        } else {
          return (
            <div className="card" key={element.title}>
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
