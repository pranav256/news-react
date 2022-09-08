import { ArticlesType } from '../types'
import SocialMediaLinks from './SocialMediaLinks'

const CardItem = ({urlToImage,title,description,publishedAt,url,author}: ArticlesType) =>{

const changeToLocalTime = (time: Date) => {
    let date = new Date(time).toLocaleString()
    return date
  }

  return (
    <div className="dark:bg-gray-900  bg-gray-200 p-2 mx-5 flex flex-col pt-6 pb-6 md:flex-row rounded-xl transition duration-150  hover:shadow-xl mt-5">
      <div className=" h-64 w-auto md:w-1/2 flex align-middle sm:justify-center">
        <img
          className="mx-0 sm:mx-4 aspect-auto"
          src={urlToImage}
          loading="lazy"
          alt={title}
        />
      </div>
      <div className=" dark:text-white w-full py-4 px-6 text-gray-800 flex flex-col justify-between">
        <h3 className="font-semibold text-lg leading-tight ">{title}</h3>
        <p className="mt-1">{description}</p>

        <p className="dark:text-white text-sm text-gray-700 uppercase tracking-wide font-semibold mt-2">
          {author} &bull; {changeToLocalTime(publishedAt)}
        </p>
        <a
          href={url}
          target="_blank"
          className="text-sm mt-2 dark:text-blue-500  text-blue-700 tracking-wide"
        >
          Read more about this article;
        </a>
      </div>
      <SocialMediaLinks title={title} url={url} />
    </div>
  )
}

export default CardItem
