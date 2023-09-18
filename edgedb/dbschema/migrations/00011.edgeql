CREATE MIGRATION m1kxzutf4rsq2w63dufuk2an2lozawu4pbw7hks4f3v4zfnwczgceq
    ONTO m1dbg5qphjotharb3f772n653on4qwjyysgur5hw3m32vcytk3iiea
{
  ALTER TYPE default::User {
      ALTER PROPERTY hankoUuid {
          RENAME TO hankoId;
      };
  };
};
