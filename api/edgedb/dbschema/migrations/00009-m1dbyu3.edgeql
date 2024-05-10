CREATE MIGRATION m1dbyu3m5g5ue6wawsuskcal6n7uekzwav5rhavblndqt6s6bt2vma
    ONTO m1gvujtsnjxvuqnr7o4rezomjr3zbcjsitbszpg7gcyeuv5rbp6wca
{
  ALTER GLOBAL default::current_user USING (std::assert_single((SELECT
      default::User
  FILTER
      (.identity = GLOBAL ext::auth::ClientTokenIdentity)
  )));
};
