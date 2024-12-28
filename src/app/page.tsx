import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import Image from 'next/image';

const url = `${process.env.BASE_URL}/spaces/${process.env.SPACE_ID}/environments/master/entries?access_token=${process.env.ACCESS_TOKEN}`;

const options = {
  renderText: (text: string) => {
    return text.split('\n').reduce((children: JSX.Element[], textSegment: string, index: number) => {
      // Wrap textSegment in a React Fragment or span to ensure it's a JSX.Element
      return [
        ...children,
        index > 0 && <br key={index} />,
        <span key={index}>{textSegment}</span>, // Wrap the text in a span
      ];
    }, []);
  },
  renderNode: {
    'embedded-asset-block': (node: any) => {
      const image = node.data.target.fields.file;
      return (
        <div className="mb-6">
          <Image
            src={'https:' + image.url}
            alt={image.title}
            width={500}
            height={500}
            className="rounded-md shadow-lg"
          />
        </div>
      );
    },
  },
};

export default async function Home() {
  const response = await fetch(url, { cache: 'no-store' });
  const data = await response.json();

  return (
    <main className="max-w-4xl mx-auto p-6">
      <header>
        <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-8">My Blog</h1>
      </header>
      {data.items.map((a: any, index: number) => {
        const image = data.includes.Asset.find(
          (asset: any) => asset.sys.id === a.fields.image.sys.id
        );

        // Check if authorImage exists before accessing it
        const authorImage = a.fields.authorImage
          ? data.includes.Asset.find(
              (asset: any) => asset.sys.id === a.fields.authorImage.sys.id
            )
          : null;

        // Format the date
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
              {/* Render author image if available */}
              {authorImage && (
                <div className="mr-4">
                  <Image
                    src={'https:' + authorImage?.fields.file.url}
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

            {/* Render the blog body */}
            <div className="mb-6">
              {documentToReactComponents(a.fields.body, options)}
            </div>

            {/* Display image */}
            <div className="mb-6">
              <Image
                src={'https:' + image?.fields.file.url}
                alt={image?.fields.title}
                width={800}
                height={450}
                className="rounded-lg shadow-lg"
              />
            </div>
          </article>
        );
      })}
    </main>
  );
}
