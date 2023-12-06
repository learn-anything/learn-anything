CREATE MIGRATION m1euwbp6hjnzuuvkwyyt6kzbevzwyj4ul22ujqaq6xl2bjghvoz47q
    ONTO m1v6jpkyxahrenyxnabezzbnf4lj55senylzkeia3pb4t66i2qy7uq
{
  ALTER TYPE default::User {
      ALTER LINK completedLinks {
          RENAME TO linksBookmarked;
      };
  };
  ALTER TYPE default::User {
      ALTER LINK likedLinks {
          RENAME TO linksCompleted;
      };
  };
  ALTER TYPE default::User {
      ALTER LINK linksToComplete {
          RENAME TO linksLiked;
      };
  };
};
