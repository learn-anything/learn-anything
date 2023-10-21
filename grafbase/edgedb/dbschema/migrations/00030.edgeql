CREATE MIGRATION m1oridabn5og2autbovoe3kvlkjde77tukyhe52peenq7jn4oobeqa
    ONTO m1qftigo2kyobokc33eqdws6b4wcsfeuwccgfbt5fouwz5iomute6q
{
  ALTER TYPE default::PersonalLink {
      CREATE LINK mainTopic: default::GlobalTopic;
  };
};
