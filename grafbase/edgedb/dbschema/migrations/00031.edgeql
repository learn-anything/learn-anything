CREATE MIGRATION m1rlr7cga5ghyxq662vvdlyszibncbzllf632ejph6udmshfbxb7cq
    ONTO m1oridabn5og2autbovoe3kvlkjde77tukyhe52peenq7jn4oobeqa
{
  ALTER TYPE default::User {
      ALTER LINK personalLinks {
          ON TARGET DELETE ALLOW;
      };
  };
};
