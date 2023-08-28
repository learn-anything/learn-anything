CREATE MIGRATION m13vjt3qv2pnvovbl6f77snnli5x77nawiggehqoectzuzei44sjma
    ONTO m1ttov2vgklbijrxmcyg35adqqczofc4kuttua3yrbale4mhtasw3a
{
  CREATE TYPE default::RelatedLink {
      CREATE PROPERTY title: std::str;
      CREATE PROPERTY url: std::str;
  };
  ALTER TYPE default::GlobalLink {
      CREATE MULTI LINK relatedLinks: default::RelatedLink;
  };
  ALTER TYPE default::Link {
      ALTER LINK relatedLinks {
          SET TYPE default::RelatedLink USING (.relatedLinks[IS default::RelatedLink]);
      };
  };
};
