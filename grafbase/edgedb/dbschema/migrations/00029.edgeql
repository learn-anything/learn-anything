CREATE MIGRATION m1qftigo2kyobokc33eqdws6b4wcsfeuwccgfbt5fouwz5iomute6q
    ONTO m1y6wzfda6yl7wekpf2amajudflghwxoi3wthj23omdzjz54ixrjta
{
  ALTER TYPE default::UserGuideSection {
      DROP PROPERTY order;
  };
};
