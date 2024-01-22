CREATE MIGRATION m15ewityi7r35mb7x27pdgv4rjdcrjnffb7u2djn5uqq7yz4a66ksq
    ONTO m1ayry7oe3b3ysukvgfrmhgbxmib2tqrx6ifo42zwtwwdwz34waafa
{
  ALTER TYPE default::PersonalLink {
      ALTER LINK globalLink {
          CREATE CONSTRAINT std::exclusive;
      };
  };
};
