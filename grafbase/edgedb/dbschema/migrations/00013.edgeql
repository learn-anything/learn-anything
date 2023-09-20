CREATE MIGRATION m1i2uhmctlle7ixftq4wnt6kkzkzbmzjr2twmhnjqlhxcagizurnqa
    ONTO m1s7p655dowcndyfs4ksjz5dedsk2vt72xvbofpygyogq26dkoweuq
{
  ALTER TYPE default::GlobalLink {
      CREATE PROPERTY fullUrl: std::str;
  };
};
