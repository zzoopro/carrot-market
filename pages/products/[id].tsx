import { Product, User } from "@prisma/client";
import type { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import useSWR from "swr";
import useMutation from "../../libs/client/useMutation";
import { cls } from "../../libs/client/utils";
import Button from "../components/button";
import Layout from "../components/layout";

interface ProductWithUser extends Product {
  user: User;
}
interface ProductResponse {
  ok: boolean;
  product: ProductWithUser;
  relatedProduct: Product[];
  isLiked: boolean;
}

const ItemDetail: NextPage = () => {
  const router = useRouter();
  const { data, mutate } = useSWR<ProductResponse>(
    router.query.id ? `/api/products/${router.query.id}` : null
  );
  const [likeProduct] = useMutation(
    `/api/products/${router.query.id}/favorite`
  );
  const onFavClick = () => {
    if (!data) return;
    mutate({ ...data, isLiked: !data.isLiked }, false);
    likeProduct({});
  };
  return (
    <Layout title="Item" canGoBack>
      <div>
        <div className="px-4 py-10">
          <div className="w-full h-96 bg-gray-500" />
          <div className="flex items-center mt-4">
            <div className="h-10 w-10 bg-gray-600 rounded-full mr-2" />
            <div>
              <p className="font-bold text-sm">{data?.product?.user?.name}</p>
              <Link href={`/users/profile/${data?.product?.user?.id}`}>
                <a className="text-gray-600 text-xs mt-1">
                  View profile &rarr;
                </a>
              </Link>
            </div>
          </div>
          <div className="mt-3">
            <h1 className="text-sm text-gray-600 font-medium select-none">
              {data?.product?.name}
            </h1>
            <p className="text-[22px] font-bold select-none">
              ${data?.product?.price}
            </p>
            <p className="mt-2 text-[12px] text-justify">
              {data?.product?.description}
            </p>
            <div className="flex items-center justify-between mt-3">
              <Button text="Talk to seller"></Button>
              <button
                onClick={onFavClick}
                className={cls(
                  `p-2 ml-1 rounded-md`,
                  data?.isLiked
                    ? "hover:bg-red-100 text-red-500"
                    : "text-gray-500 hover:bg-gray-100"
                )}
              >
                {data?.isLiked ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                      clip-rule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg
                    className="h-5 w-5 "
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
        <div className="p-5">
          <h2 className="text-center font-semibold text-lg">Similar items</h2>
          <div className="grid grid-cols-2 mt-2 gap-5">
            {data?.relatedProduct.map((product) => (
              <Link href={`/products/${product.id}`}>
                <div key={product.id} className="select-none">
                  <div className="w-full aspect-square bg-gray-500 cursor-pointer" />
                  <h3 className="mt-1 text-sm cursor-pointer">
                    {product.name}
                  </h3>
                  <p className="text-xl font-bold">${product.price}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ItemDetail;
