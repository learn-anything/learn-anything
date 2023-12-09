CREATE MIGRATION m1gms3ojznxahxo3vcpxvmkecvwykpfqiaduqyzgqi73a4bbze25ra
    ONTO m1p2puqzgtgtqz7s5qexok2226tzfanegeqliio57lbmplz767gwra
{
  ALTER TYPE default::PersonalLink {
      DROP LINK mainTopic;
      DROP PROPERTY description;
      DROP PROPERTY protocol;
      DROP PROPERTY title;
      DROP PROPERTY url;
      DROP PROPERTY year;
  };
  ALTER TYPE default::User {
      DROP LINK personalLinks;
  };
  DROP TYPE default::PersonalLink;
};
