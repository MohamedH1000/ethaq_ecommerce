// pages/api/search.ts
import { searchProducts } from "@/lib/actions/search.action";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { query, page = 1, limit = 6 } = req.query;
    if (!query) {
      return res.status(400).json({ error: "Query is required" });
    }
    // Simulate fetching products (replace with actual logic)
    const results = await searchProducts({
      query: String(query),
      page: Number(page),
      limit: Number(limit),
    });

    return res.json({
      products: results.items,
      totalPages: Math.ceil(results.totalCount / Number(limit)),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
