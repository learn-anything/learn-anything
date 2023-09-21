CREATE MIGRATION m1z5lh4sqbbzt557m2ywdb7abw6dxr4t5peh24y5ft7rewngas3h5a
    ONTO m1i2uhmctlle7ixftq4wnt6kkzkzbmzjr2twmhnjqlhxcagizurnqa
{
  ALTER TYPE default::GlobalLink {
      CREATE REQUIRED PROPERTY verified: std::bool {
          SET REQUIRED USING (<std::bool>true);
      };
  };
  ALTER TYPE default::User {
      ALTER PROPERTY proMemberUntil {
          RENAME TO memberUntil;
      };
  };
};
