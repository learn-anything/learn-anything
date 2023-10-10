CREATE MIGRATION m1qxzqsbe7z2w2tu7ccsfaq3jpcl5kd6o2dxngzwbbhflnum7yt6qa
    ONTO m1j2lj3lfmbd2f7dxirkg3xgg5ivj6cclg3sllne43eopelwjx6e4a
{
  ALTER TYPE default::GlobalGuideSection {
      ALTER LINK links {
          CREATE PROPERTY order: std::int16;
      };
  };
};
