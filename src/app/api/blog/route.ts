// ここにgetやpostのリクエストを返していく。
import { PrismaClient } from "@/generated/prisma";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// データベースに接続する用の関数を用意
export async function main() {
  try {
    await prisma.$connect();
  } catch (err) {
    return Error("データベース接続に失敗しました。");
  } finally {
  }
}

// 全記事取得用のAPI
export const GET = async (req: Request, res: NextResponse) => {
  try {
    // 上で定義した関数mainを実行（接続）
    await main();
    // ここでPostモデルから全記事取得
    const posts = await prisma.post.findMany({
      orderBy: {
        data: "desc",
      },
    });
    return NextResponse.json(
      { message: "全記事取得成功", posts },
      { status: 200 }
    );
  } catch (err) {
    console.error("記事取得失敗:", err);
    return NextResponse.json({ message: "記事取得失敗", err }, { status: 500 });
  } finally {
    // 接続を切る
    await prisma.$disconnect();
  }
};

// ブログ投稿用のAPI
export const POST = async (req: Request, res: NextResponse) => {
  try {
    // 投稿した内容(req)からtitleとdescriptionに入る
    const { title, description } = await req.json();
    // 上で定義した関数mainを実行（接続）
    await main();
    // ここでpostモデルから全記事取得
    const post = await prisma.post.create({ data: { title, description } });
    return NextResponse.json(
      { message: "全記事取得成功", post },
      { status: 201 }
    );
  } catch (err) {
    return NextResponse.json({ message: "記事取得失敗", err }, { status: 500 });
  } finally {
    // 接続を切る
    await prisma.$disconnect();
  }
};
