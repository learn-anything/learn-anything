CREATE MIGRATION m1j25z7ce2ylvhuh2saowrnw4lpl52vcu5uhafue6k2fj6mrjfswwa
    ONTO m1wkob2fhm4i5zwwm347i6b7kusmltzavjqjym4dbncjhyp2wxt7wa
{
  ALTER TYPE default::GlobalLink {
      ALTER PROPERTY url {
          CREATE CONSTRAINT std::exclusive;
      };
  };
};
