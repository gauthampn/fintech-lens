import { NextResponse } from "next/server";
import { fetchRepos } from "@/lib/github";

export const revalidate = 600;

export async function GET() {
  try {
    const repos = await fetchRepos();
    return NextResponse.json(repos);
  } catch (error) {
    console.error("Error fetching repos:", error);
    return NextResponse.json(
      { error: "Failed to fetch repositories" },
      { status: 500 }
    );
  }
}
