CREATE MIGRATION m164ob35rmseyoplmaku3dmozimupzxcasflcp4bygoez2f5nzgnma
    ONTO m1fuckbrowgc5mvlbmxnnio5gaepwajn4ms7427d6rjoaahwtryvea
{
  ALTER TYPE default::Topic {
      DROP PROPERTY publishedContent;
  };
};
