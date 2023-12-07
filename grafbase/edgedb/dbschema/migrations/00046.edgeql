CREATE MIGRATION m1p2puqzgtgtqz7s5qexok2226tzfanegeqliio57lbmplz767gwra
    ONTO m1euwbp6hjnzuuvkwyyt6kzbevzwyj4ul22ujqaq6xl2bjghvoz47q
{
  ALTER TYPE default::User {
      CREATE PROPERTY linksTracked := ((((std::count(.linksBookmarked) + std::count(.linksInProgress)) + std::count(.linksCompleted)) + std::count(.linksLiked)));
  };
};
