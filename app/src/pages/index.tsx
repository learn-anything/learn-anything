import React from "react";
import gql from "graphql-tag";
import { useQuery } from "urql";

const queryTopics = gql`
  query {
    topics {
      key
    }
  }
`;

interface TopicData {
  topics: Topic[];
}

interface Topic {
  key: string;
}

const IndexPage = () => {
  const [result] = useQuery<TopicData>({
    query: queryTopics,
  });

  if (result.fetching || !result.data) {
    return null;
  }

  if (result.error) {
    return null;
  }

  return (
    <div>
      <h1>Learn Anything</h1>
      <ul>
        {result.data.topics.map((topic) => (
          <li>{topic.key}</li>
        ))}
      </ul>
    </div>
  );
};

export default IndexPage;
