import { PrismaClient } from "@/generated/prisma";
import { main } from "../route";
import { NextResponse } from "next/server";

// prismaはインスタンス化しないといけない
const prisma = new PrismaClient();

// ブログの詳細記事(一つの記事を抜き出す)
export const GET = async (req: Request, res: NextResponse) => {
  try {
    // URLのidを切り取ってidとして変数で使えるようにしてる
    const id: number = parseInt(req.url.split("/blog/")[1]);
    // 上で定義した関数mainを実行（接続）
    await main();
    // ここでPostモデルからある一つの記事取得
    const post = await prisma.post.findFirst({ where: { id } });
    return NextResponse.json(
      { message: "全記事取得成功", post },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json({ message: "記事取得失敗", err }, { status: 500 });
  } finally {
    // 接続を切る
    await prisma.$disconnect();
  }
};

// ブログの編集用のAPI
export const PUT = async (req: Request, res: NextResponse) => {
  try {
    // URLのidを切り取ってidとして変数で使えるようにしてる
    const id: number = parseInt(req.url.split("/blog/")[1]);
    // 投稿した内容(req)を編集したいからtitleとdescriptionが欲しいので変数として使えるようにする
    const { title, description } = await req.json();
    // 上で定義した関数mainを実行（接続）
    await main();
    // ここでPostモデルからある一つの記事取得
    const post = await prisma.post.update({
      // update関数は必ずwhereとdataが必要
      where: { id },
      data: { title, description },
    });
    return NextResponse.json(
      { message: "全記事取得成功", post },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json({ message: "記事取得失敗", err }, { status: 500 });
  } finally {
    // 接続を切る
    await prisma.$disconnect();
  }
};

// 削除用のAPI
export const DELETE = async (req: Request, res: NextResponse) => {
  try {
    // URLのidを切り取ってidとして変数で使えるようにしてる
    const id: number = parseInt(req.url.split("/blog/")[1]);
    // 上で定義した関数mainを実行（接続）
    await main();
    //data: { title, description }の記述はいらない。idだけで済む話だから
    const post = await prisma.post.delete({
      // update関数は必ずwhereとdataが必要
      where: { id },
    });
    return NextResponse.json(
      { message: "全記事取得成功", post },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json({ message: "記事取得失敗", err }, { status: 500 });
  } finally {
    // 接続を切る
    await prisma.$disconnect();
  }
};
