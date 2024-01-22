CREATE MIGRATION m15xnr5qtpgrlfks5lbjul4btnnuhqyuzmva6dbxhlaf3a7teetbba
    ONTO m1gms3ojznxahxo3vcpxvmkecvwykpfqiaduqyzgqi73a4bbze25ra
{
  CREATE TYPE default::PersonalLink {
      CREATE REQUIRED LINK globalLink: default::GlobalLink;
      CREATE LINK mainTopic: default::GlobalTopic;
      CREATE PROPERTY description: std::str;
      CREATE PROPERTY title: std::str;
  };
};
