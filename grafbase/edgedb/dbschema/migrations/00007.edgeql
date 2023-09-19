CREATE MIGRATION m1psqqs7d4brzm55zsplc6kl4yy4yndyv4zeeqmhz6zkf6wvld6yfa
    ONTO m1fszg7hh6t6ii2f3dl77ofjpsutufgz4bl47cw3w6owndslqch33a
{
  ALTER TYPE default::GlobalLink {
      CREATE PROPERTY protocol: std::str;
  };
};
