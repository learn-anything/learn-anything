CREATE MIGRATION m1wkob2fhm4i5zwwm347i6b7kusmltzavjqjym4dbncjhyp2wxt7wa
    ONTO m1z5lh4sqbbzt557m2ywdb7abw6dxr4t5peh24y5ft7rewngas3h5a
{
  ALTER TYPE default::GlobalLink {
      CREATE PROPERTY mainTopicAsString: std::str;
  };
};
