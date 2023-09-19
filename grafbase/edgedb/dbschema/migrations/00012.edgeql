CREATE MIGRATION m1s7p655dowcndyfs4ksjz5dedsk2vt72xvbofpygyogq26dkoweuq
    ONTO m1kxzutf4rsq2w63dufuk2an2lozawu4pbw7hks4f3v4zfnwczgceq
{
  ALTER TYPE default::GlobalLink {
      ALTER PROPERTY url {
          SET REQUIRED USING (<std::str>{});
      };
  };
};
