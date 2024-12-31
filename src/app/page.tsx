import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { Document } from "@contentful/rich-text-types";
import Image from "next/image";

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

type BlogPost = {
  fields: {
    title: string;
    authorName: string;
    date: string;
    body: Document;
    image: Asset;
    authorImage?: Asset | null;
  };
};

export const revalidate = 60;

export default async function Home() {
  const url = `https://cdn.contentful.com/spaces/${process.env.SPACE_ID}/environments/master/entries?access_token=${process.env.ACCESS_TOKEN}`;
  
  let items = [];
  let assets = [];
  
  try {
    const response = await fetch(url, { cache: "default" });
    const data = await response.json();

    // Debugging: Log API response
    console.log("Contentful API Response:", JSON.stringify(data, null, 2));

    items = data.items || [];
    assets = data.includes?.Asset || [];
  } catch (error) {
    console.error("Failed to fetch Contentful data:", error);
  }

  return (
    <main className="max-w-4xl mx-auto p-6 border border-gray-200">
      {items.length > 0 ? (
        items.map((post: BlogPost, index: number) => {
          const image = assets.find(
            (asset: Asset) => asset.sys.id === post.fields.image.sys.id
          );

          const authorImage = post.fields.authorImage
            ? assets.find(
                (asset: Asset) =>
                  asset.sys.id === post.fields.authorImage?.sys.id
              )
            : null;

          const date = new Date(post.fields.date || Date.now());
          const formattedDate = date.toLocaleDateString("en-US", {
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "numeric",
          });

          return (
            <article
              key={index}
              className="mb-16 bg-white p-8 rounded-lg shadow-lg"
            >
              <div className="flex items-center mb-6">
                {authorImage && (
                  <Image
                    src={"https:" + authorImage.fields.file.url}
                    alt={post.fields.authorName || "Author"}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                )}
                <div className="ml-4">
                  <h2 className="text-2xl font-semibold text-gray-800">
                    {post.fields.title || "Untitled"}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {post.fields.authorName || "Anonymous"} - {formattedDate}
                  </p>
                </div>
              </div>
              <div className="mb-6">
                {post.fields.body
                  ? documentToReactComponents(post.fields.body)
                  : "No content available."}
              </div>
              {image && (
                <Image
                  src={"https:" + image.fields.file.url}
                  alt={image.fields.title || "Image"}
                  width={800}
                  height={450}
                  className="rounded-lg shadow-lg"
                />
              )}
            </article>
          );
        })
      ) : (
        <p className="text-center text-gray-600">
          No blog posts available at the moment.
        </p>
      )}
    </main>
  );
}

export const dynamic = "force-dynamic";
