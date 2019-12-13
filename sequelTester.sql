\c nc_news_test

-- SELECT articles.article_id, articles.title, articles.votes, articles.topic, articles.author, articles.created_at, COUNT(comments.article_id) AS comment_count FROM articles
--   LEFT JOIN comments ON comments.article_id = articles.article_id
--   GROUP BY articles.article_id;

SELECT * FROM articles WHERE article_id=4