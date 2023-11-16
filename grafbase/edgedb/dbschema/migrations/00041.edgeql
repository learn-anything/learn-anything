CREATE MIGRATION m1iy2yvlzplt4wipqwqumvhxa45odob3n3dap7pqtsfxb35slzcrga
    ONTO m164ob35rmseyoplmaku3dmozimupzxcasflcp4bygoez2f5nzgnma
{
  ALTER TYPE default::Topic {
      ALTER PROPERTY public {
          RESET OPTIONALITY;
      };
      ALTER PROPERTY published {
          SET REQUIRED USING (<std::bool>true);
      };
  };
  ALTER TYPE default::User {
      ALTER PROPERTY freeActions {
          SET default := 5;
          CREATE CONSTRAINT std::min_value(0);
      };
  };
};
