CREATE MIGRATION m1y6wzfda6yl7wekpf2amajudflghwxoi3wthj23omdzjz54ixrjta
    ONTO m1olq2zk2pcubmu2wwfkcx3ek2j6vccqweu4iqrgxjhypnisx355nq
{
  ALTER TYPE default::GlobalGuideSection {
      DROP PROPERTY order;
  };
};
