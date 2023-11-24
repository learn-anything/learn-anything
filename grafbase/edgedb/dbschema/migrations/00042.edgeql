CREATE MIGRATION m1pppmv4yqgxywd7s5ojlsbocfisxqtjlhjcxlwo36hgwpsnsgdjda
    ONTO m1iy2yvlzplt4wipqwqumvhxa45odob3n3dap7pqtsfxb35slzcrga
{
  ALTER TYPE default::User {
      DROP PROPERTY freeActions;
  };
};
