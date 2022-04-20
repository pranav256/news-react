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
    <div class="bg-gray-100 mx-5 flex flex-col pt-6 pb-6 md:flex-row rounded-xl hover:shadow-xl mt-5">
      <div class="h-64 w-auto md:w-1/2 flex align-middle">
        <img class="mx-0 sm:mx-4" src={imgUrl} />
      </div>
      <div class="w-full py-4 px-6 text-gray-800 flex flex-col justify-between">
        <h3 class="font-semibold text-lg leading-tight ">{title}</h3>
        <p class="mt-1">{description}</p>
        <p class="text-sm text-gray-700 uppercase tracking-wide font-semibold mt-2">
          {site_name} &bull; {changeToLocalTime(published_time)}
        </p>
      </div>
      <SocialMediaLinks title={title} url={url} />
    </div>
  );
}

export default CardItem;
