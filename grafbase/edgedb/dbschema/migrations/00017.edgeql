CREATE MIGRATION m1vdr6qze2zd7mhcskmmls7lgpbzuhggwzmomifbqgj5flb7x4woma
    ONTO m1j25z7ce2ylvhuh2saowrnw4lpl52vcu5uhafue6k2fj6mrjfswwa
{
  ALTER TYPE default::GlobalLink {
      ALTER PROPERTY protocol {
          SET REQUIRED USING (<std::str>{});
      };
  };
};
