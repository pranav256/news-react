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
        <div className="img-holder">
          <img src={imgUrl} className="img-card" alt="..." />
        </div>
        <div className="card-body-container">
          <div className="card-body">
            <h3 className="card-title">{title}</h3>
            <p className="card-text">{description}</p>
            <a
              className="readMoreLink"
              href={url}
              rel="noopener noreferrer"
              target="_BLANK"
            >
              Click Here to read more
            </a>
            <p>{!site_name ? "" : `By ${site_name}`}</p>
            <p className="card-text">{changeToLocalTime(published_time)}</p>
            <SocialMediaLinks title={title} url={url} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default CardItem;
