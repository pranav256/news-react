import React from "react";
import SocialMediaLinks from "./SocialMediaLinks";
function CardItem({
  imgUrl,
  title,
  description,
  url,
  published_time,
  site_name,
}) {
  const changeToLocalTime = (time) => {
    let date = new Date(time).toLocaleString();
    return date;
  };
  return (
    <div className="card">
      <div className="row">
        <div className="imgHolder">
          <img src={imgUrl} className="imgCard" alt="..." loading="lazy"  />
        </div>
        <div className="cardBodyContainer">
          <div className="cardBody">
            <h3 className="cardTitle">{title}</h3>
            <p className="cardText">{description}</p>
            <a
              className="readMoreLink"
              href={url}
              rel="noopener noreferrer"
              target="_BLANK"
            >
              Click Here to read more
            </a>
            <p>{!site_name ? "" : `By ${site_name}`}</p>
            <p className="cardText">{changeToLocalTime(published_time)}</p>
            <SocialMediaLinks title={title} url={url} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default CardItem;
