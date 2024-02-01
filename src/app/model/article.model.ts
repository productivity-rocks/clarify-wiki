export interface Article {
  _id: string;
  title: string; // example: "How to use TypeScript"; For website title
  description: string; // example: "We explain how to simply use ..."; For website meta description
  content: string; // as markdown; example: "# Title\n ## Subtitle\n Content"
  tags: string; // example: "news, sports, fy bayern"
  path: string; // example: "how-to-use-typescript"; For website URL
  created_at: string; // example: 2024-01-29 17:51:00
  author_name: string;
  author_id: string;
  language: string; // example: "en"
}