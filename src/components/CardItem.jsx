import React from "react";
import SocialMediaLinks from "./SocialMediaLinks";
function Carditem({
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
            <h5 className="card-title">{title}</h5>
            <p className="card-text">{description}</p>
            <p className="card-text">{changeToLocalTime(published_time)}</p>
            <p>{!site_name ? "" : `By ${site_name}`}</p>
            <a
              className="readMoreLink"
              href={url}
              rel="noopener noreferrer"
              target="_BLANK"
            >
              Click Here to read more
            </a>
            <SocialMediaLinks title={title} url={url} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Carditem;
