CREATE MIGRATION m1dzhryeetci7bkldztjrlxfcgekaehbxw4tozfmvz2e4tcctepftq
    ONTO m1nzyo7y2nj65eufpsqoycvhh2pczg6ydepmsydxqed4nynyeu2iyq
{
  ALTER TYPE default::GlobalLink {
      CREATE PROPERTY year: std::str;
  };
  ALTER TYPE default::Link {
      ALTER LINK globalLink {
          ON TARGET DELETE ALLOW;
      };
      CREATE PROPERTY year: std::str;
  };
};
