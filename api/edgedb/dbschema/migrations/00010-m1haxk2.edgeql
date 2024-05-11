CREATE MIGRATION m1haxk2fgxtptgb5tvuwo44fms6verwu5m2mthtxxq5wsfurkre2wq
    ONTO m1dbyu3m5g5ue6wawsuskcal6n7uekzwav5rhavblndqt6s6bt2vma
{
  ALTER TYPE default::Other RENAME TO default::GlobalState;
  ALTER TYPE default::User {
      ALTER PROPERTY email {
          RESET OPTIONALITY;
      };
  };
};
