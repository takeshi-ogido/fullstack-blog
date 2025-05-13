"use client";
import { useRouter } from "next/navigation";
import React, { useRef } from "react";
import toast, { Toaster } from "react-hot-toast";
// APIを叩くようの関数を作る
const postBlog = async (
  title: string | undefined,
  description: string | undefined
) => {
  const res = await fetch(`http://localhost:3000/api/blog`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title,
      description,
    }),
  });
  return res.json();
};

const PostBlog = () => {
  const router = useRouter();

  const titleRef = useRef<HTMLInputElement | null>(null);
  const descriptionRef = useRef<HTMLTextAreaElement | null>(null);
  // (e:React.FormEvent<HTMLFormElement>)の方がいい。
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    // try,catch文で一つ一つ制御をかける
    const loadingToast = toast.loading("投稿中...", { id: "loading" });
    try {
      await postBlog(titleRef.current?.value, descriptionRef.current?.value);
      toast.success("投稿完了！", { id: "success" });
      router.push("/");
      router.refresh();
      toast.dismiss(loadingToast);
    } catch (error) {
      toast.error("投稿失敗", { id: "error" });
      toast.dismiss(loadingToast);
    }

    // 動画通り（toastの表示に制が書けられない）
    // toast.loading("投稿中...", { id: "loading" });

    // await postBlog(titleRef.current?.value, descriptionRef.current?.value);

    // toast.success("投稿完了！", { id: "success" });

    // router.push("/");
    // router.refresh();
  };

  return (
    <div>
      <Toaster />
      <div className="w-full m-auto flex my-4">
        <div className="flex flex-col justify-center items-center m-auto">
          <p className="text-2xl text-slate-200 font-bold p-3">
            ブログ新規作成 🚀
          </p>
          <form onSubmit={handleSubmit}>
            <input
              ref={titleRef}
              placeholder="タイトルを入力"
              type="text"
              className="rounded-md px-4 w-full py-2 my-2"
            />
            <textarea
              ref={descriptionRef}
              placeholder="記事詳細を入力"
              className="rounded-md px-4 py-2 w-full my-2"
            ></textarea>
            <button className="font-semibold px-4 py-2 shadow-xl bg-slate-200 rounded-lg m-auto hover:bg-slate-100">
              投稿
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostBlog;
