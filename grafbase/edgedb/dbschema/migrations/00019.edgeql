CREATE MIGRATION m1j2lj3lfmbd2f7dxirkg3xgg5ivj6cclg3sllne43eopelwjx6e4a
    ONTO m13sdfblf3xnxt6viifzd2rkylb2p6temelc2xix3x4bcfvjxzzirq
{
  ALTER TYPE default::GlobalGuide {
      ALTER LINK sections {
          ON TARGET DELETE ALLOW;
      };
  };
};
