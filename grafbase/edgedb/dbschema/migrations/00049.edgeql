CREATE MIGRATION m1ayry7oe3b3ysukvgfrmhgbxmib2tqrx6ifo42zwtwwdwz34waafa
    ONTO m15xnr5qtpgrlfks5lbjul4btnnuhqyuzmva6dbxhlaf3a7teetbba
{
  ALTER TYPE default::GlobalTopic {
      ALTER PROPERTY topicSummary {
          RESET OPTIONALITY;
      };
  };
};
