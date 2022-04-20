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
    <div className="bg-gray-100 mx-5 flex flex-col pt-6 pb-6 md:flex-row rounded-xl hover:shadow-xl mt-5">
      <div className="h-64 w-auto md:w-1/2 flex align-middle">
        <img className="mx-0 sm:mx-4" src={imgUrl} />
      </div>
      <div className="w-full py-4 px-6 text-gray-800 flex flex-col justify-between">
        <h3 className="font-semibold text-lg leading-tight ">{title}</h3>
        <p className="mt-1">{description}</p>
        <p className="text-sm text-gray-700 uppercase tracking-wide font-semibold mt-2">
          {site_name} &bull; {changeToLocalTime(published_time)}
        </p>
      </div>
      <SocialMediaLinks title={title} url={url} />
    </div>
  );
}

export default CardItem;
