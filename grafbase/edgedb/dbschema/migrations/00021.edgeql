CREATE MIGRATION m17iund4zc6hq6uyqyzzqhys735elepdefwl6uwftucwy63samh6gq
    ONTO m1qxzqsbe7z2w2tu7ccsfaq3jpcl5kd6o2dxngzwbbhflnum7yt6qa
{
  ALTER TYPE default::GlobalGuideSection {
      CREATE PROPERTY summary: std::str;
  };
};
