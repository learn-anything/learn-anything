CREATE MIGRATION m13sdfblf3xnxt6viifzd2rkylb2p6temelc2xix3x4bcfvjxzzirq
    ONTO m1vdr6qze2zd7mhcskmmls7lgpbzuhggwzmomifbqgj5flb7x4woma
{
  ALTER TYPE default::GlobalLink {
      DROP PROPERTY mainTopicAsString;
  };
};
