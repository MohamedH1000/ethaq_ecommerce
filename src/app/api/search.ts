// pages/api/search.ts
import { searchProducts } from "@/lib/actions/search.action";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { query, page = 1, limit = 6 } = req.query;

  // Implement your search logic here (database, Algolia, etc.)
  const results = await searchProducts({
    query: String(query),
    page: Number(page),
    limit: Number(limit),
  });

  res.json({
    products: results.items,
    totalPages: Math.ceil(results.totalCount / Number(limit)),
  });
}
