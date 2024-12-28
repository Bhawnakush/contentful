import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { Document } from '@contentful/rich-text-types';
import Image from 'next/image';

type Asset = {
  sys: {
    id: string;
  };
  fields: {
    file: {
      url: string;
    };
    title: string;
  };
};

type AuthorImage = Asset | null;

type BlogPost = {
  fields: {
    title: string;
    authorName: string;
    date: string;
    body: Document; // Use the correct type for rich text
    image: Asset;
    authorImage?: Asset;
  };
};

const url = `https://cdn.contentful.com/spaces/${process.env.SPACE_ID}/environments/master/entries?access_token=${process.env.ACCESS_TOKEN}`;

export default async function Home() {
  const response = await fetch(url, { cache: 'no-store' });
  const data = await response.json();

  return (
    <main className="max-w-4xl mx-auto p-6">
      <header>
        <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-8">My Blog</h1>
      </header>
      {data.items.map((a: BlogPost, index: number) => {
        const image = data.includes.Asset.find(
          (asset: Asset) => asset.sys.id === a.fields.image.sys.id
        );

        let authorImage: AuthorImage = null;
        if (a.fields.authorImage) {
          authorImage = data.includes.Asset.find(
            (asset: Asset) => asset.sys.id === a.fields.authorImage?.sys.id
          ) || null;
        }

        const date = new Date(a.fields.date);
        const formattedDate = date.toLocaleDateString('en-US', {
          weekday: 'short',
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        });

        return (
          <article key={index} className="mb-16 bg-white p-8 rounded-lg shadow-lg">
            <div className="flex items-center mb-6">
              {authorImage && (
                <div className="mr-4">
                  <Image
                    src={'https:' + authorImage.fields.file.url}
                    alt={a.fields.authorName}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                </div>
              )}
              <div>
                <h2 className="text-2xl font-semibold text-gray-800">{a.fields.title}</h2>
                <p className="text-sm text-gray-500">
                  {a.fields.authorName} - {formattedDate}
                </p>
              </div>
            </div>

            <div className="mb-6">
              {documentToReactComponents(a.fields.body)}
            </div>

            {image && (
              <div className="mb-6">
                <Image
                  src={'https:' + image.fields.file.url}
                  alt={image.fields.title}
                  width={800}
                  height={450}
                  className="rounded-lg shadow-lg"
                />
              </div>
            )}
          </article>
        );
      })}
    </main>
  );
}
