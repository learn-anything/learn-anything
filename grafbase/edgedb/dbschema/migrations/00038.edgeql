CREATE MIGRATION m1ocj25vftkrf3ryuuckxe6y7jew6qxhl5topa5rv54fg7vwmu64sa
    ONTO m1b3u3ntzrzpxhihhuhkkjtoj2anl7snxbjoorhblfdcag4hzl7wrq
{
  ALTER TYPE default::User {
      ALTER PROPERTY freeActions {
          SET default := 5;
      };
  };
};
